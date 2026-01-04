## 2026-01-04 - Server-Side Filtering for Active Orders
**Learning:** The frontend was fetching ALL orders and filtering them client-side. This is inefficient as the dataset grows. The backend was modified to accept an 'activos' parameter to filter server-side.
**Action:** Always prefer server-side filtering for large datasets.
