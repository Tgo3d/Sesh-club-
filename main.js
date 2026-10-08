const formatPrice = (price) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
const productGrid = document.querySelector("#product-grid");
const categoryGrid = document.querySelector("#category-grid");
const cartCount = document.querySelector(".cart-count");
const toast = document.querySelector("#toast");
const cartModal = document.querySelector("#cart-modal");
const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const checkoutStatus = document.querySelector("#checkout-status");
const customerForm = document.querySelector("#customer-form");

const CHECKOUT_API = "https://sesh-club-pagamentos.tiago-rodriguess.workers.dev/create-preference";
const FREE_SHIPPING_THRESHOLD = 199;

// Valores iniciais de frete por UF. Edite esta tabela quando definir as tarifas comerciais definitivas.
const SHIPPING_BY_UF = {
  SP: 19.90, RJ: 24.90, MG: 24.90, ES: 24.90,
  PR: 29.90, SC: 29.90, RS: 29.90,
  GO: 29.90, DF: 29.90, MS: 29.90, MT: 29.90,
  BA: 34.90, SE: 34.90, AL: 34.90, PE: 34.90, PB: 34.90, RN: 34.90, CE: 34.90, PI: 34.90, MA: 34.90,
  AM: 39.90, PA: 39.90, AC: 39.90, AP: 39.90, RO: 39.90, RR: 39.90, TO: 39.90
};

const CART_STORAGE_KEY = "sesh-club-cart-v1";
let cart = [];
try {
  const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  cart = Array.isArray(savedCart) ? savedCart : [];
} catch {
  cart = [];
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}
let shipping = { cep: "", uf: "", value: null, city: "", street: "", neighborhood: "", loading: false };

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderProducts() {
  productGrid.innerHTML = SESh_PRODUCTS.map((product) => `
    <article class="product-card">
      <a class="product-card-link" href="product.html?id=${product.id}" aria-label="Ver detalhes de ${product.name}">
        <div class="product-photo">
          <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" />
          <span>${product.tag}</span>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.short}</p>
          <strong>${product.variants ? `A partir de ${formatPrice(product.price)}` : formatPrice(product.price)}</strong>
        </div>
      </a>
      <div class="product-actions">
        <a class="product-details-link" href="product.html?id=${product.id}">Ver detalhes</a>
        <button class="add-button" data-product="${product.id}" aria-label="${product.variants ? `Escolher opções de ${product.name}` : `Adicionar ${product.name} ao carrinho`}">COMPRAR</button>
      </div>
    </article>`).join("");
}

function renderCategories() {
  categoryGrid.innerHTML = SESh_CATEGORIES.map((category) => `
    <a class="category" href="#produtos"><span>${category.icon}</span><b>${category.name}</b></a>`).join("");
}

function subtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function shippingValue() {
  const sub = subtotal();
  if (!cart.length || sub >= FREE_SHIPPING_THRESHOLD) return 0;
  return Number.isFinite(shipping.value) ? shipping.value : null;
}

function total() {
  const freight = shippingValue();
  return subtotal() + (freight || 0);
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
  if (!cart.length) {
    cartList.innerHTML = `<div class="cart-empty"><strong>Seu carrinho está vazio.</strong><span>Escolha uma peça e bora para a sessão.</span></div>`;
  } else {
    cartList.innerHTML = cart.map((item) => `
      <article class="cart-item">
        <div class="cart-item-thumb" style="background-image:url('${item.image}')"></div>
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${formatPrice(item.price)}${item.variant_label ? ` · ${item.variant_label}` : ""}</span>
          <div class="cart-item-controls">
            <button type="button" data-action="decrease" data-key="${item.cartKey || item.id}" aria-label="Diminuir quantidade">−</button>
            <b>${item.quantity}</b>
            <button type="button" data-action="increase" data-key="${item.cartKey || item.id}" aria-label="Aumentar quantidade">+</button>
            <button class="cart-remove" type="button" data-action="remove" data-key="${item.cartKey || item.id}">Remover</button>
          </div>
        </div>
        <strong class="cart-item-total">${formatPrice(item.price * item.quantity)}</strong>
      </article>`).join("");
  }

  const sub = subtotal();
  const freight = shippingValue();
  const hasCep = /^\d{5}-?\d{3}$/.test(shipping.cep);
  const shippingLabel = !cart.length ? "R$ 0,00" :
    sub >= FREE_SHIPPING_THRESHOLD ? "Grátis" :
    shipping.loading ? "Calculando…" :
    !hasCep ? "Informe o CEP" :
    freight == null ? "CEP inválido" : formatPrice(freight);

  cartTotal.textContent = formatPrice(total());
  const summary = document.querySelector(".cart-summary");
  if (summary) {
    summary.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(sub)}</strong></div>
      <div class="summary-row"><span>Frete</span><strong>${shippingLabel}</strong></div>
      <div class="summary-row summary-total"><span>Total</span><strong id="cart-total">${formatPrice(total())}</strong></div>`;
  }

  const requiresShipping = cart.length > 0 && sub < FREE_SHIPPING_THRESHOLD;
  const requiredNow = ["name","email","phone","cep","street","number","neighborhood","city","uf"];
  const addressComplete = requiredNow.every((field) => String(customerForm?.elements?.[field]?.value || "").trim());
  checkoutButton.disabled = !cart.length || !addressComplete || shipping.loading || !hasCep || !shipping.uf || !shipping.city || !shipping.street || !shipping.neighborhood || (requiresShipping && shipping.value == null);
}

function openCart() {
  cartModal.classList.add("open");
  cartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  renderCart();
}

function closeCart() {
  cartModal.classList.remove("open");
  cartModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function lookupCep(cep) {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) {
    shipping = { ...shipping, cep, uf: "", value: null, city: "", street: "", neighborhood: "", loading: false };
    customerForm.elements.city.value = "";
    customerForm.elements.uf.value = "";
    customerForm.elements.street.value = "";
    customerForm.elements.neighborhood.value = "";
    renderCart();
    return;
  }

  shipping = { ...shipping, cep, loading: true, value: null, uf: "", city: "", street: "", neighborhood: "" };
  renderCart();
  checkoutStatus.textContent = "Consultando CEP…";

  try {
    const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const data = await response.json();
    if (!response.ok || data.erro || !data.uf) throw new Error("CEP não encontrado");
    const value = SHIPPING_BY_UF[data.uf];
    shipping = {
      cep: clean.replace(/^(\d{5})(\d{3})$/, "$1-$2"),
      uf: data.uf,
      value: value ?? null,
      city: data.localidade || "",
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      loading: false
    };
    customerForm.elements.city.value = data.localidade || "";
    customerForm.elements.uf.value = data.uf || "";
    customerForm.elements.street.value = data.logradouro || "";
    customerForm.elements.neighborhood.value = data.bairro || "";
    checkoutStatus.textContent = value == null ? "Ainda não há tarifa configurada para este estado." : `Entrega para ${data.localidade}/${data.uf}.`;
  } catch (error) {
    shipping = { ...shipping, cep, uf: "", value: null, city: "", street: "", neighborhood: "", loading: false };
    customerForm.elements.city.value = "";
    customerForm.elements.uf.value = "";
    customerForm.elements.street.value = "";
    customerForm.elements.neighborhood.value = "";
    checkoutStatus.textContent = "Não foi possível localizar esse CEP. Confira os números e tente novamente.";
  }
  renderCart();
}

async function startCheckout() {
  if (!cart.length) return;
  const formData = new FormData(customerForm);
  const email = String(formData.get("email") || "").trim();
  if (!email) {
    checkoutStatus.textContent = "Informe seu e-mail para continuar.";
    customerForm.elements.email.focus();
    return;
  }

  const freight = shippingValue();
  const sub = subtotal();
  const requiredAddress = [
    "name", "email", "phone", "cep", "street", "number", "neighborhood", "city", "uf"
  ];
  const missing = requiredAddress.find((field) => !String(formData.get(field) || "").trim());
  if (missing) {
    checkoutStatus.textContent = "Preencha todos os dados obrigatórios do endereço e contato.";
    customerForm.elements[missing]?.focus();
    return;
  }
  if (shipping.loading || !shipping.uf || !shipping.city || !shipping.street || !shipping.neighborhood) {
    checkoutStatus.textContent = "Informe um CEP válido e aguarde o preenchimento do endereço.";
    return;
  }
  if (sub < FREE_SHIPPING_THRESHOLD && freight == null) {
    checkoutStatus.textContent = "Informe um CEP válido para calcular o frete.";
    return;
  }

  checkoutButton.disabled = true;
  checkoutButton.innerHTML = "Abrindo Mercado Pago…";
  checkoutStatus.textContent = "Preparando seu pagamento com segurança…";

  try {
    const response = await fetch(CHECKOUT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({
          id: String(item.base_product_id || item.id),
          title: item.variant_label ? `${item.name} — ${item.variant_label}` : item.name,
          description: `Produto Sesh Club — ${item.name}${item.variant_label ? ` | ${item.variant_label}` : ""}`,
          quantity: item.quantity,
          unit_price: item.price
        })),
        shipping: {
          cost: freight || 0,
          cep: shipping.cep,
          uf: shipping.uf,
          city: shipping.city,
          street: String(formData.get("street") || "").trim(),
          number: String(formData.get("number") || "").trim(),
          complement: String(formData.get("complement") || "").trim(),
          neighborhood: String(formData.get("neighborhood") || "").trim()
        },
        customer: {
          name: String(formData.get("name") || "").trim(),
          email,
          phone: String(formData.get("phone") || "").trim()
        },
        external_reference: `SESH-${Date.now()}`
      })
    });

    const data = await response.json();
    if (!response.ok || !data.init_point) throw new Error(data.error || "Não foi possível criar o pagamento.");
    window.location.href = data.init_point;
  } catch (error) {
    checkoutStatus.textContent = error.message || "Não foi possível iniciar o pagamento. Tente novamente.";
    checkoutButton.disabled = false;
    checkoutButton.innerHTML = "Ir para pagamento <b>→</b>";
  }
}

renderProducts();
renderCategories();
updateCartCount();
renderCart();

if (new URLSearchParams(window.location.search).get("cart") === "1" && cart.length) {
  openCart();
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  const product = SESh_PRODUCTS.find((item) => item.id === Number(button.dataset.product));
  if (!product) return;
  if (product.variants) {
    window.location.href = `product.html?id=${product.id}`;
    return;
  }
  const existing = cart.find((item) => item.id === product.id && !item.cartKey);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  updateCartCount();
  renderCart();
  showToast(`${product.name} foi adicionado ao carrinho.`);
});

cartList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const key = button.dataset.key;
  const item = cart.find((entry) => String(entry.cartKey || entry.id) === String(key));
  if (!item) return;
  if (button.dataset.action === "increase") item.quantity += 1;
  if (button.dataset.action === "decrease") item.quantity -= 1;
  if (button.dataset.action === "remove" || item.quantity <= 0) cart = cart.filter((entry) => String(entry.cartKey || entry.id) !== String(key));
  saveCart();
  updateCartCount();
  renderCart();
});

document.querySelector(".cart-button").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
document.querySelector("#continue-shopping").addEventListener("click", closeCart);
checkoutButton.addEventListener("click", startCheckout);
customerForm.addEventListener("input", () => renderCart());

const cepInput = customerForm?.elements?.cep;
if (cepInput) {
  cepInput.addEventListener("input", () => {
    const digits = cepInput.value.replace(/\D/g, "").slice(0, 8);
    cepInput.value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    lookupCep(cepInput.value);
  });
}

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) closeCart();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartModal.classList.contains("open")) closeCart();
});

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", isOpen);
});
mainNav.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});
document.querySelector("#year").textContent = new Date().getFullYear();
