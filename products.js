/*
  SESH CLUB — EDITE A LOJA AQUI

  Para trocar um produto, altere apenas:
  - name     = nome que aparece na loja
  - price    = preço em reais (ex.: 59.90)
  - image    = caminho da foto dentro de assets/images/products/
  - position = enquadramento da foto (normalmente "center")
  - tag      = etiqueta pequena do produto

  IMPORTANTE:
  Os caminhos abaixo são relativos. Não coloque caminhos como C:/Users/...
*/
const SESh_PRODUCTS = [
  {
    id: 1,
    name: "Placas Personalizadas",
    price: 59.90,
    image: "assets/images/products/placas-personalizadas.png",
    position: "center",
    tag: "Personalizado"
  },
  {
    id: 2,
    name: "Banco Arte Urbana",
    price: 69.90,
    image: "assets/images/products/banco-arte-urbana.png",
    position: "center",
    tag: "Destaque"
  },
  {
    id: 3,
    name: "Organizador Flow",
    price: 49.90,
    image: "assets/images/products/organizador-flow.png",
    position: "center",
    tag: "Novo"
  },
  {
    id: 4,
    name: "Banco Personalizado",
    price: 79.90,
    image: "assets/images/products/banco-personalizado-roxo.png",
    position: "center",
    tag: "Personalizável"
  }
];

const SESh_CATEGORIES = [
  { icon: "✦", name: "Acessórios" },
  { icon: "▰", name: "Decoração" },
  { icon: "⌁", name: "Chaveiros" },
  { icon: "▣", name: "Organização" },
  { icon: "✎", name: "Personalizados" }
];
