## 2026-01-02 - [Frontend Re-renders]
**Learning:** High-frequency polling (2s) in the parent component caused significant re-renders in heavy child components like 'Cocina'. Derived state calculations (filtering/sorting) inside the render loop exacerbated this.
**Action:** Always memoize derived state ('useMemo') and event handlers ('useCallback') in components that receive frequent prop updates from polling sources. Verify referential stability of props passed to memoized children.
