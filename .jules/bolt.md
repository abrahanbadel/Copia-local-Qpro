## 2024-05-23 - Server-side Filtering for Polling
**Learning:** Polling large datasets on the client side is a significant performance bottleneck, especially when only a small subset of data is needed for real-time views.
**Action:** Implemented server-side filtering for the `getPedidos` endpoint. The frontend kitchen view now polls only for *active* orders (`?activos=true`), significantly reducing payload size and processing time, while other views (Reports, Billing) continue to fetch the full dataset.
