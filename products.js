
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

/*
  CATÁLOGO OFICIAL — SESH CLUB
  
  EDITAR PRODUTOS:
  1. Título/preço -> name / price
  2. Foto principal -> image
  3. Outras fotos -> gallery
  4. Texto -> short / description
  5. Características -> details
  6. Medidas -> specs
  7. Opções -> variants

  IMPORTANTE: não é necessário editar index.html ou product.html para
  cadastrar/alterar um produto. As páginas são montadas automaticamente.
*/
const SESh_PRODUCTS = [
  {
      id: 5,
      slug: "banco-porta-seda",
      name: "Praça Sesh Club",
      price: 59.90,
      image: "foto-02.webp",
      gallery: ["foto-02.webp", "foto-03.webp", "foto-04.webp", "foto-05.webp", "capa.webp", "foto-06.webp"],
      position: "center",
      tag: "Destaque Sesh Club",
      short: "Uma peça para fazer parte da sua Sesh.",
      description: "O Banco Porta Seda foi criado para incorporar a sessão de relaxamento à decoração. Reúne banco porta-seda, encosto para plaquinhas, poste removível com compartimento na luminária e lixeira basculante em uma única peça. A versão com suporte acrescenta um espaço dedicado para o isqueiro sem alterar o restante do produto.",
      details: [
        "Banco porta-seda com 110 mm de largura",
        "Praça/base com 180 mm x 73 mm",
        "Poste removível da base e utilizável como pilão",
        "Compartimento tipo mocó na parte da luminária",
        "Lixeira basculante que pode ser usada como porta-piteira ou cinzeiro",
        "As plaquinhas do encosto podem ser personalizadas na opção de produtos personalizados",
        "Envio imediato após comprovação do pagamento"
      ],
      specs: [
        { label: "Largura do banco", value: "110 mm" },
        { label: "Dimensão da praça/base", value: "180 x 73 mm" },
        { label: "Cores da lixeira", value: "Preta, azul ou branca" },
        { label: "Envio", value: "Imediato após comprovação do pagamento" }
      ],
      variants: [
        {
          id: "lixeira",
          label: "Cor da lixeira",
          options: [
            { id: "preta", label: "Preta", priceDelta: 0 },
            { id: "azul", label: "Azul", priceDelta: 0 },
            { id: "branca", label: "Branca", priceDelta: 0 }
          ]
        },
        {
          id: "suporte",
          label: "Suporte de isqueiro",
          options: [
            { id: "sem-suporte", label: "Sem suporte", priceDelta: 0 },
            { id: "com-suporte", label: "Com suporte", priceDelta: 5.00 }
          ]
        }
      ]
    },

  {
      id: 6,
      slug: "luminaria-folha",
      name: "Luminária Folha",
      price: 119.90,
      image: "luminaria-folha-01.webp",
      gallery: ["luminaria-folha-01.webp", "luminaria-folha-02.webp", "luminaria-folha-03.webp", "luminaria-folha-video.mp4"],
      position: "center",
      tag: "Novo",
      short: "Uma peça de decoração para deixar seu ambiente ainda mais marcante.",
      description: "A Luminária Folha Sesh Club foi criada para quem quer levar personalidade para o ambiente. Com formato inspirado em uma folha e acabamento nas cores da Sesh Club, ela funciona como uma peça de decoração marcante para compor aquele cantinho de relaxamento.",
      details: [
        "Peça decorativa com iluminação",
        "Design inspirado em uma folha",
        "Acabamento em preto, branco, verde e detalhes nas cores da Sesh Club",
        "Ideal para compor ambientes e espaços de relaxamento"
      ],
      specs: [],
      variants: []
    },

  {
      id: 1,
      slug: "placas-personalizadas",
      name: "Placas Personalizadas",
      price: 59.90,
      image: "placas-personalizadas.webp",
      gallery: ["placas-personalizadas.webp"],
      position: "center",
      tag: "Personalizado",
      short: "Uma peça com a sua identidade.",
      description: "Placas personalizadas para levar a identidade da Sesh Club para o seu espaço. O foco é criar uma peça com nome, frase ou identidade visual que tenha a sua cara.",
      details: [
        "Produção em impressão 3D",
        "Personalização sob consulta",
        "Cores e acabamento conforme disponibilidade"
      ],
      specs: [],
      variants: []
    },

  {
      id: 2,
      slug: "banco-arte-urbana",
      name: "Banco Arte Urbana",
      price: 69.90,
      image: "banco-arte-urbana.webp",
      gallery: ["banco-arte-urbana.webp"],
      position: "center",
      tag: "Destaque",
      short: "Arte urbana para o seu ambiente.",
      description: "Uma peça com presença visual e linguagem urbana, pensada para compor ambientes com a estética da Sesh Club.",
      details: [
        "Produção em impressão 3D",
        "Design inspirado na estética urbana",
        "Peça produzida sob demanda"
      ],
      specs: [],
      variants: []
    },

  {
      id: 3,
      slug: "organizador-flow",
      name: "Organizador Flow",
      price: 49.90,
      image: "organizador-flow.webp",
      gallery: ["organizador-flow.webp"],
      position: "center",
      tag: "Novo",
      short: "Organização com personalidade.",
      description: "Um organizador compacto para manter seus pequenos itens no lugar sem abrir mão da estética Sesh Club.",
      details: [
        "Produção em impressão 3D",
        "Design compacto",
        "Peça produzida sob demanda"
      ],
      specs: [],
      variants: []
    },

  {
      id: 4,
      slug: "banco-personalizado",
      name: "Banco Personalizado",
      price: 79.90,
      image: "banco-personalizado-roxo.webp",
      gallery: ["banco-personalizado-roxo.webp"],
      position: "center",
      tag: "Personalizável",
      short: "Uma peça feita para ser sua.",
      description: "Banco personalizado com identidade própria para quem quer uma peça diferente no ambiente. Consulte as opções de personalização disponíveis.",
      details: [
        "Produção em impressão 3D",
        "Personalização sob consulta",
        "Cores e acabamento conforme disponibilidade"
      ],
      specs: [],
      variants: []
    }
];

const SESh_CATEGORIES = [
  { icon: "✦", name: "Acessórios" },
  { icon: "▰", name: "Decoração" },
  { icon: "⌁", name: "Chaveiros" },
  { icon: "▣", name: "Organização" },
  { icon: "✎", name: "Personalizados" }
];
