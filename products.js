/*
  EDITE A LOJA AQUI.
  Para trocar uma foto, coloque a nova imagem em assets/images/ e altere o campo "image".
  Preços são números: o site adiciona R$ automaticamente.
*/
const SESh_PRODUCTS = [
  { id: 1, name: "Placas Personalizadas", price: 59.9, image: "placas-personalizadas.png", position: "center", tag: "Personalizado" },
  { id: 2, name: "Banco Arte Urbana", price: 69.9, image: "banco-arte-urbana.png", position: "center", tag: "Destaque" },
  { id: 3, name: "Organizador Flow", price: 49.9, image: "organizador-flow.png", position: "center", tag: "Novo" },
  { id: 4, name: "Banco Personalizado", price: 79.9, image: "banco-personalizado-roxo.png", position: "center", tag: "Personalizável" }
];

const SESh_CATEGORIES = [
  { icon: "✦", name: "Acessórios" },
  { icon: "▰", name: "Decoração" },
  { icon: "⌁", name: "Chaveiros" },
  { icon: "▣", name: "Organização" },
  { icon: "✎", name: "Personalizados" }
];
