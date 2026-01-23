## 2024-05-23 - [Polling Performance Bottleneck]
**Learning:** The polling mechanism in `App.js` (every 2s) was fetching the entire order history from the backend (`api.getPedidos()`), which then filtered on the client. This scales poorly as history grows.
**Action:** Implemented server-side filtering (`?activos=true`) in `PedidosController` and updated `api.js` and `App.js` to request only active orders during polling. Future pollings should always consider data volume and filter on server.
