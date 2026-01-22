## 2024-10-26 - [Optimizing Polling Efficiency]
**Learning:** The frontend was fetching ALL orders (including historical ones) every 2 seconds to update the kitchen view, relying on client-side filtering. This creates unnecessary server load and bandwidth usage.
**Action:** Implemented server-side filtering. Updated the backend `GetPedidos` endpoint to accept an `activos` parameter to filter for 'EnProceso' and 'Listo' orders. Updated the frontend polling logic to use this parameter.
