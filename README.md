# SESH CLUB — SITE EDITÁVEL

## Como visualizar

1. Extraia esta pasta inteira.
2. Abra `index.html` com o Chrome/Edge.
3. Não abra o HTML de dentro do ZIP.

O site foi estruturado para funcionar com caminhos relativos. Isso significa que ele não depende de um caminho específico do seu computador.

## Seu caminho local atual

Você estava usando este arquivo no seu computador:

`file:///C:/Users/Notxx/Documents/Codex/2026-10-05/referenced-chatgpt-conversation-this-is-an/outputs/sesh-club-site/index.html`

Esse caminho é específico do seu PC e não deve ser colocado dentro do código. O `index.html` deste pacote pode ficar em qualquer pasta, desde que a estrutura de pastas seja mantida.

## ALTERAR PRODUTOS — MAIS IMPORTANTE

Abra:

`assets/js/products.js`

É o arquivo principal para editar os produtos.

Cada produto tem este formato:

```js
{
  id: 1,
  name: "Nome do produto",
  price: 59.90,
  image: "assets/images/products/foto.png",
  position: "center",
  tag: "Novo"
}
```

### Para trocar somente a foto

1. Coloque a nova foto dentro de:

`assets/images/products/`

2. No `products.js`, altere apenas:

```js
image: "assets/images/products/minha-foto.png"
```

3. Salve.
4. Volte ao navegador e pressione `Ctrl + F5`.

### Fotos atualmente vinculadas

- Placas Personalizadas → `placas-personalizadas.png`
- Banco Arte Urbana → `banco-arte-urbana.png`
- Organizador Flow → `organizador-flow.png`
- Banco Personalizado → `banco-personalizado-roxo.png`

## Outros arquivos

- `index.html` → textos, estrutura e links da página
- `assets/css/style.css` → aparência, cores, tamanhos e animações
- `assets/js/main.js` → comportamento do site
- `assets/images/hero-praca.png` → imagem principal da seção Praça
- `assets/images/hero-studio.png` → imagem da seção de estúdio
- `assets/images/logo-sesh-club.png` → logo

## Regra importante

Não mova os arquivos de lugar sem atualizar os caminhos no código.

Não use caminhos absolutos como:

`C:/Users/Notxx/...`

Use sempre caminhos relativos, como:

`assets/images/products/foto.png`

## Observação

Esta versão é um protótipo de loja editável. O carrinho/checkout ainda é demonstrativo; pagamentos, estoque, frete e integração com marketplace podem ser adicionados posteriormente.
