## Bolt Journal

## 2024-05-22 - [Polling Architecture Impact]
**Learning:** `App.js` polls `getPedidos` every 2 seconds and updates state with a NEW array reference each time, triggering full tree re-renders. Child components like `Cocina` must use `useMemo` for any derived calculations (filtering, sorting) to prevent expensive operations on every poll cycle, even if data hasn't changed effectively.
**Action:** Always check for polling intervals in parent components when optimizing child render performance. Use `useMemo` liberally in children of `App.js`.
