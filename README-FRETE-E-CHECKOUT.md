# Sesh Club — frete e checkout

## Frete
A loja usa frete por UF com frete grátis para pedidos a partir de R$ 199,00.
Os valores ficam no topo de `main.js`, no objeto `SHIPPING_BY_UF`.

Os valores atuais são iniciais e devem ser ajustados antes da operação comercial definitiva.

## Checkout
O carrinho envia para o Cloudflare Worker:
- `items`
- `shipping.cost`
- `shipping.cep`
- `shipping.uf`
- `shipping.city`
- dados básicos do cliente

Endpoint atual:
`https://sesh-club-pagamentos.tiago-rodriguess.workers.dev/create-preference`

### Importante
O Worker precisa aceitar `body.shipping.cost` e encaminhá-lo para o Mercado Pago como `shipments.cost` para que o frete apareça separado no Checkout Pro. Se o Worker ainda não tiver essa alteração, o site continuará calculando o frete corretamente no carrinho, mas o custo ainda não será acrescentado separadamente na preferência do Mercado Pago.
