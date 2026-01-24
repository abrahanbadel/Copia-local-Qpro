## 2024-05-23 - Stale Closures in Polling
**Learning:** React `useEffect` with `setInterval` creates stale closures if the callback relies on state but the effect doesn't re-run. This caused `idsAnteriores` to be empty, triggering repeated "New Order" notifications and unnecessary re-renders.
**Action:** Use `useRef` to access the latest state inside `setInterval` callbacks without triggering effect re-execution.
