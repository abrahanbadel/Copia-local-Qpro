## 2024-05-22 - [Polling Stale Closures in React]
**Learning:** In `App.js`, the polling mechanism (`setInterval` inside `useEffect`) caused two issues:
1. **Excessive Re-renders:** Calling `setPedidos` with transformed data created new object references every 2 seconds, triggering re-renders even if data was identical.
2. **Stale Closures:** The `cargarPedidos` function closed over the initial empty `pedidos` state. The interval callback kept using this stale state to compare against "new" orders, causing the "New Order" logic to always trigger (finding all orders as new).
**Action:** When implementing polling in React components:
1. Use `useRef` to track the latest state (`pedidosRef`) for comparison logic inside callbacks that shouldn't reset the interval.
2. Always compare the new data (e.g., `JSON.stringify`) with the current state (via Ref) before triggering a state update (`setState`) to prevent unnecessary re-renders.
