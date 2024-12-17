curl 'http://localhost:18080/api/cart?currencyCode=USD' \
  -H 'content-type: application/jsson' \
  -H 'traceparent: 00-21be3d564911643eec2b48898ceac6b9-2441f616200d7e2c-01' \
  --data-raw '{"item":{"productId":"OLJCESPC7Z","quantity":1},"userId":"123"}'

# curl 'http://localhost:18080/api/cart?sessionId=123&currencyCode=USD'