
function renderGalleryMedia(src, alt = "") {
  const lower = String(src || "").toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov")) {
    return `<video class="product-gallery-video" controls playsinline preload="metadata">
      <source src="${src}" type="${lower.endsWith(".mp4") ? "video/mp4" : lower.endsWith(".webm") ? "video/webm" : "video/quicktime"}">
      Seu navegador não conseguiu reproduzir este vídeo.
    </video>`;
  }
  return `<img src="${src}" alt="${alt}" loading="lazy">`;
}

const root = document.querySelector("#produto");
const id = Number(new URLSearchParams(window.location.search).get("id"));
const product = SESh_PRODUCTS.find((item) => item.id === id);
const formatPrice = (price) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
const CART_STORAGE_KEY = "sesh-club-cart-v1";

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
}

if (!product) {
  document.title = "Produto não encontrado — Sesh Club";
  root.innerHTML = `<div class="section" style="min-height:60vh;display:grid;place-items:center;text-align:center"><div><p class="kicker">Sesh Club</p><h1>Produto não encontrado.</h1><a class="button button-primary" href="index.html#produtos">Voltar para a loja</a></div></div>`;
} else {
  document.title = `${product.name} — Sesh Club`;
  document.querySelector('meta[name="description"]').setAttribute("content", `${product.name} — ${product.short} Sesh Club.`);

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const variantGroups = Array.isArray(product.variants) ? product.variants : [];
  const hasVariants = variantGroups.length > 0;
  const selected = {};

  variantGroups.forEach((group) => {
    selected[group.id] = group.options[0]?.id;
  });

  function getSelectedOption(group) {
    return group.options.find((option) => option.id === selected[group.id]);
  }

  function currentPrice() {
    return product.price + variantGroups.reduce((total, group) => total + Number(getSelectedOption(group)?.priceDelta || 0), 0);
  }

  function variantLabel() {
    return variantGroups
      .map((group) => `${group.label}: ${getSelectedOption(group)?.label || ""}`)
      .join(" • ");
  }

  root.innerHTML = `
    <div class="product-detail-grid product-detail-grid-rich">
      <section class="product-gallery" aria-label="Fotos do ${escapeHtml(product.name)}">
        <div class="product-gallery-main" id="product-gallery-main"></div>
        <div class="product-gallery-thumbs" role="list">
          ${gallery.map((src, index) => {
            const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(src);
            return `<button class="gallery-thumb ${index === 0 ? "active" : ""}" type="button" data-gallery-index="${index}" aria-label="${isVideo ? `Ver vídeo ${index + 1}` : `Ver foto ${index + 1}`}">
              ${isVideo
                ? `<span class="gallery-video-thumb"><video src="${src}" muted playsinline preload="metadata" aria-hidden="true"></video><span class="gallery-video-label">▶ VÍDEO</span></span>`
                : `<img src="${src}" alt="" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" />`}
            </button>`;
          }).join("")}
        </div>
      </section>

      <article class="product-detail-copy">
        <p class="kicker">${escapeHtml(product.tag)}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="product-detail-lead">${escapeHtml(product.short)}</p>
        <div class="price" id="product-price">${formatPrice(currentPrice())}</div>
        <p class="description">${escapeHtml(product.description)}</p>

        ${hasVariants ? `
          <div class="product-options" id="product-options">
            ${variantGroups.map((group) => `
              <div class="option-group">
                <div class="option-label">${escapeHtml(group.label)}</div>
                <div class="option-buttons" data-option-group="${escapeHtml(group.id)}">
                  ${group.options.map((option, index) => `<button type="button" class="option-button ${index === 0 ? "selected" : ""}" data-option="${escapeHtml(group.id)}" data-value="${escapeHtml(option.id)}">${escapeHtml(option.label)}${Number(option.priceDelta || 0) ? ` — +${formatPrice(option.priceDelta)}` : ""}</button>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        ${product.specs?.length ? `
          <div class="product-detail-list-wrap">
            <h2>Informações do produto</h2>
            <ul class="product-detail-list">
              ${product.specs.map((spec) => `<li><strong>${escapeHtml(spec.label)}:</strong> ${escapeHtml(spec.value)}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <div class="product-detail-list-wrap">
          <h2>Detalhes</h2>
          <ul class="product-detail-list">${product.details.map((item) => `<li>✦ ${escapeHtml(item)}</li>`).join("")}</ul>
        </div>

        <div class="product-detail-actions">
          <button class="button button-primary" id="add-product">Adicionar ao carrinho <b>→</b></button>
          <a class="button button-ghost" href="index.html#produtos">Voltar para a loja</a>
        </div>
        <p class="product-detail-note">Frete grátis nas compras acima de R$ 199. O valor do frete é calculado pelo CEP no checkout.</p>
      </article>
    </div>

    <section class="product-story section-narrow">
      <p class="kicker">Pensado para a Sesh</p>
      <h2>Não é só um produto. É parte do ambiente.</h2>
      <p>${escapeHtml(product.description)}</p>
      ${product.id === 5 ? `<p>As plaquinhas do encosto podem ser personalizadas na opção de produtos personalizados.</p>` : ""}
    </section>`;

  function renderMainMedia(index) {
    const src = gallery[index];
    const container = document.querySelector("#product-gallery-main");
    const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(src);
    if (isVideo) {
      container.innerHTML = `<video id="product-main-video" controls playsinline preload="metadata" aria-label="${escapeHtml(product.name)} — vídeo">
        <source src="${src}" type="video/mp4">
        Seu navegador não conseguiu reproduzir este vídeo.
      </video>`;
    } else {
      container.innerHTML = `<img id="product-main-image" src="${src}" alt="${escapeHtml(product.name)} — foto ${index + 1}" decoding="async" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />`;
    }
  }

  renderMainMedia(0);

  document.querySelectorAll(".gallery-thumb").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.galleryIndex);
      renderMainMedia(index);
      document.querySelectorAll(".gallery-thumb").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  document.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.option;
      selected[key] = button.dataset.value;
      document.querySelectorAll(`.option-button[data-option="${key}"]`).forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.querySelector("#product-price").textContent = formatPrice(currentPrice());
    });
  });

  document.querySelector("#add-product").addEventListener("click", () => {
    const cart = getCart();
    const variantKey = hasVariants ? variantGroups.map((group) => `${group.id}=${selected[group.id]}`).join("|") : "default";
    const cartKey = `${product.id}:${variantKey}`;
    const existing = cart.find((item) => item.cartKey === cartKey);
    const item = {
      ...product,
      price: currentPrice(),
      base_product_id: product.id,
      cartKey,
      variant: hasVariants ? { ...selected } : null,
      variant_label: hasVariants ? variantLabel() : "",
      quantity: existing ? existing.quantity + 1 : 1
    };
    if (existing) Object.assign(existing, item);
    else cart.push(item);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.location.href = "index.html?cart=1#produtos";
  });
}
