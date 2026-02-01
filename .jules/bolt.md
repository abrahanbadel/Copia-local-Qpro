## 2024-05-23 - Performance Optimization in Reportes.js
**Learning:** `ReportesFinancieros` component was performing expensive calculations (sales analysis, filtering large arrays) on every render, causing performance degradation, especially when toggling sections.
**Action:** Wrapped expensive calculations in `useMemo` and helper functions in `useCallback` to prevent unnecessary re-computations. This serves as a pattern for other dashboard-like components in the application.
