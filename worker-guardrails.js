/**
 * SESH CLUB — Cloudflare Worker
 * Guard rails for Mercado Pago Checkout Pro + D1.
 *
 * Required bindings:
 *   env.MP_ACCESS_TOKEN  -> Secret
 *   env.DB               -> D1 database "sesh-club-orders"
 *
 * Production origin:
 *   https://tgo3d.github.io
 *
 * Deploy this file to the existing Worker "sesh-club-pagamentos".
 * Do NOT put the Mercado Pago token in the site.
 */

const ALLOWED_ORIGIN = "https://tgo3d.github.io";
const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
const FREE_SHIPPING_THRESHOLD = 199;

const SHIPPING_BY_UF = {
  SP: 19.90, RJ: 24.90, MG: 24.90, ES: 24.90,
  PR: 29.90, SC: 29.90, RS: 29.90,
  GO: 29.90, DF: 29.90, MS: 29.90, MT: 29.90,
  BA: 34.90, SE: 34.90, AL: 34.90, PE: 34.90, PB: 34.90, RN: 34.90, CE: 34.90, PI: 34.90, MA: 34.90,
  AM: 39.90, PA: 39.90, AC: 39.90, AP: 39.90, RO: 39.90, RR: 39.90, TO: 39.90
};

// Authoritative sellable catalog.
// Prices from the browser are NEVER trusted.
const CATALOG = {
  "5": {
    id: "5",
    name: "Praça Sesh Club",
    price: 59.90,
    variants: {
      lixeira: {
        preta: { label: "Preta", delta: 0 },
        azul: { label: "Azul", delta: 0 },
        branca: { label: "Branca", delta: 0 }
      },
      suporte: {
        "sem-suporte": { label: "Sem suporte", delta: 0 },
        "com-suporte": { label: "Com suporte", delta: 5.00 }
      }
    }
  },
  "6": {
    id: "6",
    name: "Luminária Folha",
    price: 119.90,
    variants: {}
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
      ...extra
    }
  });
}

function bad(message, status = 400) {
  return json({ error: message }, status);
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === ALLOWED_ORIGIN;
}

function cleanText(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

function validCep(cep) {
  return /^\d{5}-?\d{3}$/.test(cep);
}

function normalizeCep(cep) {
  const digits = String(cep).replace(/\D/g, "");
  return digits.length === 8 ? `${digits.slice(0,5)}-${digits.slice(5)}` : "";
}

function validUF(uf) {
  return /^[A-Z]{2}$/.test(uf);
}

function sanitizeQuantity(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 20 ? n : null;
}

function resolveItem(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Item inválido.");
  const id = String(raw.id || "");
  const product = CATALOG[id];
  if (!product) throw new Error(`Produto inválido: ${id}.`);

  const quantity = sanitizeQuantity(raw.quantity);
  if (!quantity) throw new Error(`Quantidade inválida para ${product.name}.`);

  const inputVariant = raw.variant && typeof raw.variant === "object" ? raw.variant : {};
  const resolvedVariant = {};
  let unitPrice = product.price;
  const labels = [];

  for (const [groupId, group] of Object.entries(product.variants)) {
    const optionId = cleanText(inputVariant[groupId], 80);
    const option = group[optionId];
    if (!option) throw new Error(`Opção inválida em ${product.name}: ${groupId}.`);
    resolvedVariant[groupId] = optionId;
    unitPrice += Number(option.delta || 0);
    labels.push(`${groupId}: ${option.label}`);
  }

  // Products with no variants reject unexpected variant data.
  if (Object.keys(product.variants).length === 0 && Object.keys(inputVariant).length) {
    throw new Error(`Este produto não possui variações: ${product.name}.`);
  }

  return {
    id,
    title: labels.length ? `${product.name} — ${labels.join(" • ")}` : product.name,
    description: `Produto Sesh Club — ${product.name}`,
    quantity,
    unit_price: Number(unitPrice.toFixed(2)),
    variant: resolvedVariant
  };
}

function validateCustomer(customer) {
  if (!customer || typeof customer !== "object") throw new Error("Dados do cliente ausentes.");
  const name = cleanText(customer.name, 120);
  const email = cleanText(customer.email, 160).toLowerCase();
  const phone = cleanText(customer.phone, 40);
  if (name.length < 3) throw new Error("Informe o nome completo.");
  if (!validEmail(email)) throw new Error("E-mail inválido.");
  if (phone.replace(/\D/g, "").length < 10) throw new Error("WhatsApp inválido.");
  return { name, email, phone };
}

function validateShipping(shipping) {
  if (!shipping || typeof shipping !== "object") throw new Error("Endereço de entrega ausente.");

  const cep = normalizeCep(shipping.cep);
  const uf = cleanText(shipping.uf, 2).toUpperCase();
  const city = cleanText(shipping.city, 100);
  const street = cleanText(shipping.street, 160);
  const number = cleanText(shipping.number, 30);
  const complement = cleanText(shipping.complement, 100);
  const neighborhood = cleanText(shipping.neighborhood, 120);

  if (!validCep(cep)) throw new Error("CEP inválido.");
  if (!validUF(uf) || !SHIPPING_BY_UF[uf]) throw new Error("UF de entrega inválida.");
  if (!city || !street || !number || !neighborhood) throw new Error("Endereço incompleto.");

  return { cep, uf, city, street, number, complement, neighborhood };
}

async function createPreference(env, request) {
  if (!env.MP_ACCESS_TOKEN) throw new Error("Mercado Pago não configurado.");
  const body = await request.json();

  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) {
    throw new Error("Carrinho inválido.");
  }

  const customer = validateCustomer(body.customer);
  const shipping = validateShipping(body.shipping);

  // Never trust title, price, subtotal, total, or freight sent by the browser.
  const items = body.items.map(resolveItem);

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2)
  );

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : SHIPPING_BY_UF[shipping.uf];

  const total = Number((subtotal + shippingCost).toFixed(2));

  const orderNumber = `SESH-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const now = new Date().toISOString();

  const preference = {
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      currency_id: "BRL",
      unit_price: item.unit_price
    })),
    payer: { email: customer.email },
    shipments: {
      cost: shippingCost,
      mode: "not_specified",
      receiver_address: {
        zip_code: shipping.cep,
        street_name: shipping.street,
        street_number: Number(shipping.number) || 0,
        city_name: shipping.city,
        state_name: shipping.uf,
        country_name: "Brasil"
      }
    },
    back_urls: {
      success: `${ALLOWED_ORIGIN}/Sesh-club-/?status=success`,
      failure: `${ALLOWED_ORIGIN}/Sesh-club-/?status=failure`,
      pending: `${ALLOWED_ORIGIN}/Sesh-club-/?status=pending`
    },
    auto_return: "approved",
    external_reference: orderNumber,
    statement_descriptor: "SESH CLUB"
  };

  const mpResponse = await fetch(MP_PREFERENCES_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preference)
  });

  const mpData = await mpResponse.json();
  if (!mpResponse.ok || !mpData.id || !mpData.init_point) {
    console.error("Mercado Pago error:", mpResponse.status, mpData);
    throw new Error("Não foi possível criar o pagamento.");
  }

  if (env.DB) {
    await env.DB.prepare(`
      INSERT INTO orders (
        order_number,
        external_reference,
        preference_id,
        payment_id,
        status,
        customer_name,
        customer_email,
        customer_phone,
        cep,
        street,
        street_number,
        complement,
        neighborhood,
        city,
        state,
        items_json,
        subtotal,
        shipping_cost,
        total,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderNumber,
      orderNumber,
      mpData.id,
      "pending",
      customer.name,
      customer.email,
      customer.phone,
      shipping.cep,
      shipping.street,
      shipping.number,
      shipping.complement,
      shipping.neighborhood,
      shipping.city,
      shipping.uf,
      JSON.stringify(items),
      subtotal,
      shippingCost,
      total,
      now,
      now
    ).run();
  }

  return json({
    preferenceId: mpData.id,
    init_point: mpData.init_point,
    orderNumber,
    subtotal,
    shippingCost,
    total
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!isAllowedOrigin(request)) {
      return json({ error: "Origin não autorizada." }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return json({ ok: true, service: "sesh-club-pagamentos", guardRails: true });
    }

    if (request.method === "POST" && url.pathname === "/create-preference") {
      try {
        const contentLength = Number(request.headers.get("Content-Length") || 0);
        if (contentLength > 50000) return bad("Requisição muito grande.", 413);
        return await createPreference(env, request);
      } catch (error) {
        console.error(error);
        return bad(error.message || "Erro ao criar pagamento.", 400);
      }
    }

    return bad("Rota não encontrada.", 404);
  }
};
