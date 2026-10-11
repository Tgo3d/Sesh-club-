# SESH CLUB — V18: história + checkout com guard rails (revisão)

## O que mudou
- Atualizado somente o texto da seção “Nossa história”, conforme validado.
- O botão “Conheça nossa história” continua apontando para `#historia` com rolagem suave.
- O `main.js` envia ao Worker apenas ID do produto, quantidade e variações; preço, subtotal, total, frete e referência do pedido não são tratados como confiáveis quando enviados pelo navegador.
- Mantidos catálogo, IDs, preços, fotos, ordem dos produtos e estados “Em breve” da V17.

## Revisão do catálogo e dos guard rails
Os identificadores e valores do catálogo conferem com `products.js`:
- ID `5`: Praça Sesh Club — base R$ 59,90; suporte de isqueiro + R$ 5,00; cores da lixeira sem acréscimo.
- ID `6`: Luminária Folha — R$ 119,90.
- IDs `1`, `2` e `3` são itens “Em breve” e não estão autorizados para checkout no Worker.
- As chaves de variação `lixeira` e `suporte` enviadas pela página do produto correspondem às esperadas pelo Worker.

## ATENÇÃO — ainda não publicar o Worker para vendas reais
`worker-guardrails.js` está incluído para revisão e próximo passo técnico, não como sinal de que o checkout está pronto para produção. Antes de liberar vendas, ainda precisamos:
1. Confirmar o esquema real da tabela D1 e testar uma inserção real de pedido pendente.
2. Implementar e validar o webhook do Mercado Pago para atualizar o status do pagamento com consulta server-to-server e validação da notificação.
3. Tratar falha do D1 após criação de preferência para não deixar o cliente sem retorno e a preferência sem registro.
4. Melhorar limites de requisição e respostas de erro; o Worker atual não tem rate limiting e seu limite de corpo depende de `Content-Length`.
5. Fazer teste ponta a ponta com pagamento de teste, cobrindo aprovado, pendente, recusado e repetição de notificação.
6. Confirmar as tarifas comerciais de frete: as tabelas atuais são valores fixos estimados por UF.

## Cloudflare
O Worker não é atualizado pelo ZIP do site. Quando chegar a hora, o código será revisado e publicado separadamente no Worker `sesh-club-pagamentos`, mantendo o Secret `MP_ACCESS_TOKEN` e o binding D1 `DB`. Nunca coloque o token no site nem o compartilhe no chat.
