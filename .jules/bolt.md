## 2024-05-23 - Server-side Filtering for Polling
**Learning:** Polling large datasets on the client side is a significant performance bottleneck, especially when only a small subset of data is needed for real-time views.
**Action:** Implemented server-side filtering for the `getPedidos` endpoint. The frontend kitchen view now polls only for *active* orders (`?activos=true`), significantly reducing payload size and processing time, while other views (Reports, Billing) continue to fetch the full dataset.
## 2024-05-21 - Verify Facturacion Usage
**Observation:** `Facturacion.js` uses `api.getPedidos()` and then filters:
```javascript
const pedidosFiltrados = pedidosData.filter(pedido =>
  pedido.estado === 'Entregado' ||
  pedido.estado === 'Pagado' ||
  pedido.estado === 'Cancelado'
);
```
It needs delivered, paid, and cancelled orders.
If I use `api.getPedidos(true)` (active orders only), I assume "active" means `EnProceso`, `Listo`. Maybe `Entregado` is also considered active until paid?
Memory says: "The backend `EstadoPedido` enum includes values: `EnProceso`, `Listo`, `Entregado`, `Pagado`, and `Cancelado`."
Usually, "active" implies `EnProceso` and `Listo`. `Entregado` might be active if it's waiting for payment. `Pagado` and `Cancelado` are definitely inactive.

If the backend `activos=true` returns `Entregado` orders too, then `Facturacion` can use it for *pending* invoices, but it seems `Facturacion` displays history too (Paid and Cancelled).
So `Facturacion.js` SHOULD continue using `api.getPedidos()` (all orders) or `api.getPedidos(false)`.

The optimization target is `Cocina` view, which only cares about `EnProceso` and `Listo`.
In `App.js`:
```javascript
const pedidosTransformados = data
  .filter(p => p.estado !== 'Entregado' && p.estado !== 'Pagado' && p.estado !== 'Cancelado')
```
This filter effectively keeps only `EnProceso` and `Listo` (and maybe others if they exist, but enum says those are the ones).
So `App.js` `cargarPedidos` *specifically* wants active orders (EnProceso/Listo).

Wait, `Cocina.js` shows "Listo" orders too.
Does `App.js` filter exclude `Entregado`? Yes.
So `App.js` logic for `Cocina` view matches exactly what `activos=true` likely returns (or a subset of it).

Hypothesis: `activos=true` returns `EnProceso` and `Listo`.
If `activos=true` returns `Entregado` as well, `App.js` filter will handle it.
The key benefit is filtering out `Pagado` and `Cancelado` (and possibly `Entregado` if backend considers it inactive) on the server.

So, the plan stands:
1. Update `api.getPedidos` to accept `activos` param.
2. Update `App.js` to use `api.getPedidos(true)` inside `cargarPedidos`.
3. Verify that `Facturacion.js` calls `api.getPedidos()` (which defaults to `false`) so it still gets everything.

Wait, `App.js` manages `pedidos` state.
This `pedidos` state is passed to `Cocina`.
Does `App.js` pass `pedidos` to `Facturacion`?
Looking at `App.js`:
```javascript
case 'facturacion':
  return <ProtectedRoute permisos={['administrador', 'caja']}><Facturacion /></ProtectedRoute>;
```
`Facturacion` component fetches its *own* data in `useEffect`. It does NOT use the `pedidos` from `App.js`.
`Cocina` DOES use `pedidos` from `App.js`.
```javascript
case 'cocina':
  return (
    <ProtectedRoute permisos={['administrador', 'cocina']}>
      <Cocina pedidos={pedidos} onActualizarPedidos={cargarPedidos} />
    </ProtectedRoute>
  );
```
So changing `cargarPedidos` in `App.js` to fetch only active orders is SAFE for `Cocina` view and `App.js` state, provided `App.js` state is not used for anything that requires inactive orders.
The only other user of `pedidos` state in `App.js` is the "Menu Cliente" view (for showing order status?).
In "Menu Cliente" view (`renderMenuCliente`), `pedidos` state is NOT used. `carrito` is used.
Wait, `App.js` seems to be the main container.
Does the customer see their order status?
I don't see code in `renderMenuCliente` that displays the status of `pedidos`.
It only shows the menu and cart.

However, `cargarPedidos` is called:
```javascript
useEffect(() => {
  // Inicializar pedidos para tener referencia inicial
  if (vistaActual === 'cocina' || esPantallaCocina) {
    cargarPedidos();
  }
}, []);
```
And polling:
```javascript
useEffect(() => {
  if ((vistaActual === 'cocina' || esPantallaCocina) && !esClienteQR) {
    cargarPedidos();
    // ⚡ Actualización cada 2 segundos
    const interval = setInterval(cargarPedidos, 2000);
    return () => clearInterval(interval);
  }
}, [vistaActual, esPantallaCocina, esClienteQR]);
```
So `cargarPedidos` is primarily for the Kitchen view.

There is one check in `App.js`:
```javascript
// ...
  if (nuevos.length > 0) {
    console.log('🔔 Nuevos pedidos detectados:', nuevos.length);
// ...
```
This logic relies on `pedidos`. If `pedidos` only contains active orders, it works fine for detecting new active orders.

Conclusion: It is safe to optimize `App.js` to fetch only active orders.

Implementation details:
`web/mi-restaurante/src/services/api.js`:
```javascript
export const getPedidos = async (activos = false) => {
  try {
    const url = activos ? `${API_URL}/pedidos?activos=true` : `${API_URL}/pedidos`;
    const response = await fetchWithHeaders(url);
// ...
```

`web/mi-restaurante/src/App.js`:
In `cargarPedidos`:
```javascript
const data = await api.getPedidos(true); // Fetch only active orders
```

One detail: `App.js` currently filters:
```javascript
.filter(p => p.estado !== 'Entregado' && p.estado !== 'Pagado' && p.estado !== 'Cancelado')
```
If `activos=true` returns `Entregado` orders (which might be considered "active" until paid), we should keep the filter in `App.js` just in case, to maintain exact behavior.
This is robust.

Let's prepare the diffs.
I need to run tests first to ensure baseline is green. I already did.

Wait, I should check if `api.getPedidos` is called anywhere else in `App.js` or passed as prop.
It's imported as `* as api`.

I'll start with `web/mi-restaurante/src/services/api.js`.
Then `web/mi-restaurante/src/App.js`.
Then run tests.
Then verify `Facturacion.js` doesn't need changes (it calls `getPedidos()` which means `activos=false`).

Let's do it.
## 2025-06-23 - API Polling Optimization
**Learning:** The polling mechanism in `App.js` was fetching the entire order history every 2 seconds, causing massive bandwidth usage and unnecessary processing. The backend supports server-side filtering via `activos=true`, which significantly reduces payload size. Also, state updates were unconditional, causing re-renders even when data hadn't changed.
**Action:** Always check for server-side filtering options for list endpoints. Implement deep equality checks (or JSON stringify for simple objects) before setting state from polled data.
# Bolt's Journal

## 2024-05-23 - Initial Setup
**Learning:** Found an empty `main` branch, but active development is on `RestaurantApp/AppMovil`. Switched to the correct branch to find the code.
**Action:** Always check all branches (`git branch -a`) if the current working directory appears empty or inconsistent with the task description.
