## 2024-05-22 - Server-Side Filtering
**Learning:** Polling large datasets (all orders) and filtering on client side is a major bandwidth bottleneck, especially for high-frequency polling (every 2s).
**Action:** Implement server-side filtering (e.g., `?activos=true`) to return only necessary data, significantly reducing payload size.
