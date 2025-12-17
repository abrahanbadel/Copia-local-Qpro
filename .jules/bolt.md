## 2025-06-23 - API Polling Optimization
**Learning:** The polling mechanism in `App.js` was fetching the entire order history every 2 seconds, causing massive bandwidth usage and unnecessary processing. The backend supports server-side filtering via `activos=true`, which significantly reduces payload size. Also, state updates were unconditional, causing re-renders even when data hadn't changed.
**Action:** Always check for server-side filtering options for list endpoints. Implement deep equality checks (or JSON stringify for simple objects) before setting state from polled data.
