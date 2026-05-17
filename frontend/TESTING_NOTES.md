# Frontend Testing Notes

Frontend test tooling is intentionally not preconfigured to keep the starter lightweight for a 3-4 hour task.

Suggested future pattern (optional):

- `vitest` + `@testing-library/react` + `@testing-library/jest-dom`
- Keep tests focused on behavior, not snapshots
- First candidates for tests:
  - `src/lib/statusRules.ts` transition helper
  - `src/components/assessments/Badge.tsx` risk/status labels
  - `src/components/assessments/StatusActions.tsx` disabled/enabled controls by role

Suggested scripts when adding tooling:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```
