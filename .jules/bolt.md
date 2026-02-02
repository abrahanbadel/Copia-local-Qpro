## 2024-05-22 - Stale Closures in Polling
**Learning:** React `setInterval` polling often captures stale state if the callback isn't memoized or if dependencies are omitted to avoid resetting the interval. This causes correctness bugs (filtering against empty state) and performance issues (redundant updates).
**Action:** Use `useRef` to track the latest state for polling callbacks, and implement deep comparison (e.g. `JSON.stringify`) before updating state to avoid re-renders when data hasn't changed.
