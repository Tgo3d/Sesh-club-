const formatPrice = (price) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
const productGrid = document.querySelector("#product-grid");
const categoryGrid = document.querySelector("#category-grid");
const cartCount = document.querySelector(".cart-count");
const toast = document.querySelector("#toast");
let cartItems = 0;

function renderProducts() {
  productGrid.innerHTML = SESh_PRODUCTS.map((product) => `
    <article class="product-card">
      <div class="product-photo" style="background-image: url('${product.image}'); background-position: ${product.position};">
        <span>${product.tag}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div><strong>${formatPrice(product.price)}</strong><button class="add-button" data-product="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">＋</button></div>
      </div>
    </article>`).join("");
}

function renderCategories() {
  categoryGrid.innerHTML = SESh_CATEGORIES.map((category) => `
    <a class="category" href="#produtos"><span>${category.icon}</span><b>${category.name}</b></a>`).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

renderProducts();
renderCategories();

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  cartItems += 1;
  cartCount.textContent = cartItems;
  const product = SESh_PRODUCTS.find((item) => item.id === Number(button.dataset.product));
  showToast(`${product.name} foi adicionado ao carrinho.`);
});

document.querySelector(".cart-button").addEventListener("click", () => {
  showToast(cartItems ? `${cartItems} item(ns) no carrinho.` : "Seu carrinho está vazio.");
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
