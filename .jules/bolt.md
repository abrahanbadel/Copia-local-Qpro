## 2024-05-24 - Server-Side Filtering vs Client-Side Filtering
**Learning:** Fetching all records and filtering on the client is a major bottleneck for the "Kitchen" view, which polls every 2 seconds. As the number of completed orders grows, this becomes unsustainable.
**Action:** Always implement server-side filtering for polled endpoints. Added `activos` parameter to `GetPedidos` to filter out completed orders at the database level.
