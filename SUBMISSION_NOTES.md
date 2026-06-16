# Submission Notes

## What you completed

- Task 1: Implemented dashboard controls end-to-end: search (candidate/employer/role), risk-level filter, status filter, and submitted-date sorting, with URL-driven state and loading handling via App Router.
- Task 2: Implemented paginated assessment list API + UI: backend page-number pagination (default page size 25), frontend next/previous controls, and page/count context.
- Task 3: Wired assessment detail actions:
  - Status transition actions with role-aware restrictions, valid-transition enforcement, and clear API validation errors.
  - Review note submission with minimum-length validation and server-side persistence.

## What you skipped
- Did not implement sorting by risk level or status, as this was not required for the core workflow and timebox.
- Did not add component-level error boundaries beyond route-level error handling.
- Frontend automated test setup (left as future work; noted in `frontend/TESTING_NOTES.md`).

## What you would improve next

- Add frontend tests (Vitest + Testing Library) focusing on filter behavior, status transition rules, and review-note validation/errors.
- Add lightweight API documentation (endpoint contracts and example error payloads) and a small integration smoke-test script.

## Any assumptions

- Only clinicians can change assessment status and add review notes.

## Time spent

- Setup: 0.5 hours
- Task 1: 1.5 hours (with some time to get familiar with the codebase / codestyle)
- Task 2: 1 hours
- Task 3: 0.5 hours

## PR
- [Task 1 PR](https://github.com/KerrYuan/medrisk_hometask/pull/2)
- [Task 2 PR](https://github.com/KerrYuan/medrisk_hometask/pull/3)
- [Task 3 PR](https://github.com/KerrYuan/medrisk_hometask/pull/4)
