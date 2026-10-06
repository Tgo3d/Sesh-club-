# Sesh Club — site editável

Abra `index.html` em qualquer navegador para visualizar o site. Não é necessário instalar nada.

## Trocas fáceis

- **Produtos, preços, nomes e posição das fotos:** `assets/js/products.js`
- **Fotos:** adicione arquivos em `assets/images/` e coloque o caminho em `products.js`
- **Textos da página e links (WhatsApp, Instagram etc.):** `index.html`
- **Cores, tipografia, espaçamentos e animação de fumaça:** `assets/css/style.css`
- **Logo oficial:** substitua o arquivo `assets/images/logo-sesh-club.png`, usando o mesmo nome.

## Fotos de produto

As quatro peças iniciais usam recortes diferentes da imagem de demonstração para deixar a home pronta para visualização. Quando houver fotos reais, troque o campo `image` de cada produto em `assets/js/products.js`; cada produto pode ter sua própria foto.

As primeiras fotos reais já tratadas estão em `assets/images/products/`. Elas ainda não foram vinculadas aos cards porque os nomes comerciais e preços não foram definidos; isso evita publicar informação incorreta.

## O que precisa de código

Criar páginas novas, checkout com pagamentos, cálculo de frete, controle de estoque e integrações de e-commerce exigem desenvolvimento adicional. O botão de carrinho desta primeira versão é demonstrativo.

## Fumaça e acessibilidade

A fumaça é feita em CSS; não usa vídeo, biblioteca ou arquivo pesado. Ela é desligada automaticamente para pessoas que preferem reduzir movimentos no aparelho.
