## 2024-05-22 - Stale Closure in Polling Interval
**Learning:** The polling interval in `App.js` was using a `useEffect` with limited dependencies, capturing a stale `cargarPedidos` closure. This meant `idsAnteriores` (derived from `pedidos`) was always empty, causing the "New Orders" logic to trigger falsely on every poll, and `setPedidos` to run on every poll, causing re-renders.
**Action:** Use `useRef` to track state inside intervals or callbacks that shouldn't reset the interval. Use deep comparison to prevent unnecessary state updates.
