
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
      slug: "tubete",
      name: "Tubete",
      price: null,
      image: "tubete-em-breve.webp",
      gallery: ["tubete-em-breve.webp"],
      position: "center",
      tag: "Em breve",
      status: "em-breve",
      short: "Porta cigarros com tampa magnética, pensado para levar sua Sesh com praticidade.",
      description: "O Tubete Sesh Club será um porta cigarros com tampa magnética, desenvolvido para unir praticidade, proteção e a identidade da Sesh Club.",
      details: ["Porta cigarros com tampa magnética", "Projeto em desenvolvimento", "Disponibilidade em breve"],
      specs: [],
      variants: []
    },

  {
      id: 2,
      slug: "porta-isqueiros-personalizados",
      name: "Porta Isqueiros Personalizados",
      price: null,
      image: "porta-isqueiros-em-breve.webp",
      gallery: ["porta-isqueiros-em-breve.webp"],
      position: "center",
      tag: "Em breve",
      status: "em-breve",
      short: "Organize seus isqueiros com uma peça personalizada no estilo Sesh Club.",
      description: "Um porta isqueiros pensado para organização e personalização. O projeto ainda está em desenvolvimento e chegará em breve à loja.",
      details: ["Personalização planejada", "Projeto em desenvolvimento", "Disponibilidade em breve"],
      specs: [],
      variants: []
    },

  {
      id: 3,
      slug: "cinzeiro-sesh-club",
      name: "Cinzeiro Sesh Club",
      price: null,
      image: "cinzeiro-sesh-em-breve.webp",
      gallery: ["cinzeiro-sesh-em-breve.webp"],
      position: "center",
      tag: "Em breve",
      status: "em-breve",
      short: "Um cinzeiro com a identidade da Sesh Club para completar seu espaço.",
      description: "O Cinzeiro Sesh Club está em desenvolvimento e será mais uma peça para compor aquele espaço de relaxamento com a identidade da marca.",
      details: ["Design Sesh Club", "Projeto em desenvolvimento", "Disponibilidade em breve"],
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
