## 2024-10-27 - [Polling Stale Closure Bug]
**Learning:** React `useEffect` intervals capturing state variables (like `pedidos`) created a stale closure where the interval callback always saw the initial state. This caused logic bugs (duplicate "new order" notifications) and performance issues (calculating against old data).
**Action:** Always use `useRef` to track the latest state when using it inside a `setInterval` or use functional state updates if applicable. For expensive polling, use deep comparison on the Ref content before triggering state updates to prevent unnecessary re-renders.
