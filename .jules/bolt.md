## 2024-05-22 - Server-Side Filtering for Polling
**Learning:** Polling large datasets (like all orders) without server-side filtering creates unnecessary network load and processing overhead, especially when the client only needs a small subset (active orders).
**Action:** Always check if polling endpoints support filtering parameters. If not, implement them on the backend (`[FromQuery]`) to reduce payload size.

## 2024-05-22 - Frontend Verification with Mocked Backend
**Learning:** When the backend environment is unavailable, frontend changes that depend on API responses can still be partially verified by intercepting network requests in Playwright to confirm the correct parameters are being sent.
**Action:** Use `page.on("request", ...)` in Playwright to assert URL parameters even if the request fails.
