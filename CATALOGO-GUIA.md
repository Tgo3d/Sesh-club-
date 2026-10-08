# Como editar os produtos — Sesh Club

O catálogo fica todo em `products.js`.

## Alterar um produto

Abra `products.js` e procure pelo produto. Você pode alterar:

- `name`: título do produto
- `price`: preço inicial
- `image`: foto de capa
- `gallery`: fotos da página do produto
- `tag`: selo exibido no produto
- `short`: frase curta
- `description`: descrição completa
- `details`: lista de características
- `specs`: informações técnicas/medidas
- `variants`: opções que o cliente pode escolher

## Fotos

As fotos devem ficar dentro do projeto, preferencialmente em:

`nome-do-produto/`

Use WebP para manter o site leve.

A primeira imagem de `gallery` é a capa da página do produto. O campo `image` deve apontar para essa mesma capa.

Exemplo:

```js
image: "capa.webp",
gallery: [
  "capa.webp",
  "02.webp",
  "03.webp"
]
```

## Variações

Cada grupo de variação tem um `id`, um `label` e suas opções.

O preço base fica em `price`. Uma opção pode acrescentar valor usando `priceDelta`.

Exemplo:

```js
variants: [
  {
    id: "cor",
    label: "Cor",
    options: [
      { id: "preto", label: "Preto", priceDelta: 0 },
      { id: "azul", label: "Azul", priceDelta: 0 }
    ]
  },
  {
    id: "suporte",
    label: "Suporte",
    options: [
      { id: "sem", label: "Sem suporte", priceDelta: 0 },
      { id: "com", label: "Com suporte", priceDelta: 5.00 }
    ]
  }
]
```

A página do produto e o carrinho montam essas opções automaticamente.

## Importante

Não altere `main.js`, `product-page.js`, `index.html` ou `product.html` para fazer mudanças comuns de catálogo. Esses arquivos são a estrutura do site.


### Produto adicionado
- **Luminária Folha** — R$ 119,90
- Imagem principal: `luminaria-folha-01.webp`
- Galeria: `luminaria-folha-01.webp`, `luminaria-folha-02.webp`, `luminaria-folha-03.webp`

- Vídeo da Luminária Folha: `luminaria-folha-video.mp4` (último item da galeria).
