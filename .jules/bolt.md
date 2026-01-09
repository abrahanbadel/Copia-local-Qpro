## 2024-05-22 - O(N*M) Lookup Pattern
**Learning:** In the `Facturacion` component, an O(N*M) lookup was used inside the render loop (finding payments for each order). This scales poorly.
**Action:** Use a `Map` (hash map) to index the lookups (payments by order ID) before iterating, reducing complexity to O(N). Also, wrap expensive derived state in `useMemo`.
