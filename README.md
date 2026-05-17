# Medrisk Full Stack Engineer Home Task

## Context

Medrisk is building workforce medical risk assessment technology for candidate screening, clinical review workflows, enterprise reporting, and operational decision support.

This home task is designed to assess whether a candidate can quickly understand a realistic product slice, make sensible frontend/backend decisions, and deliver production-minded code without excessive hand-holding.

The task intentionally resembles a small part of Medrisk's platform: an internal assessment review dashboard used by clinicians and operational/admin users.

## What this task tests

Primary signals:

- Strong React / Next.js / TypeScript frontend execution
- Dashboard/list/detail workflow implementation
- Attention to UI detail and product quality
- Django REST API design and validation
- PostgreSQL-backed persistence
- Role-aware behaviour and basic RBAC thinking
- Clean separation between domain logic, API logic, and UI logic
- Ability to work from realistic but incomplete requirements
- Communication of assumptions, trade-offs, and next steps

This is not intended to test algorithm tricks. It is intended to test whether you can contribute to a real SaaS product quickly and safely.

## Expected timebox

Please spend **3 to 4 hours maximum**.

If you run out of time, submit what you have and include a short note describing:

- What you completed
- What you skipped
- What you would improve next
- Any assumptions you made
- Approximate time spent

A smaller, clean, well-explained submission is better than an over-engineered or unfinished one.

## Tech stack

This starter project uses:

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Plain fetch-based API client

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL

### Local development

- Docker Compose
- Seed script for sample assessment data

## Local setup

### 1. Start the stack

```bash
docker compose up --build
```

This starts:

- Frontend: http://localhost:3000
- API: http://localhost:8000/api
- PostgreSQL: localhost:5432

### 2. Run migrations and seed data

In another terminal:

```bash
docker compose exec api python manage.py migrate
docker compose exec api python manage.py seed_assessments
```

Then open:

```txt
http://localhost:3000
```

### 3. Run backend tests

```bash
docker compose exec api python manage.py test
```

## Existing starter implementation

The starter repo gives you:

- Basic Next.js App Router setup
- Basic Django REST Framework API
- PostgreSQL Docker Compose setup
- Assessment, review note, and audit event models
- Seed data
- Basic dashboard page
- Basic assessment detail page
- API client helpers
- Domain types
- Minimal CSS/Tailwind setup

The starter code is deliberately incomplete. Your job is to improve and complete the workflow.

## Product scenario

Internal Medrisk users need to review candidate medical risk assessments.

A candidate assessment has:

- Candidate name
- Employer
- Role title
- Submitted date
- Risk level
- Review status
- Assigned clinician
- Risk flags
- Assessment summary
- Clinical review notes
- Audit trail

Two user roles are simulated:

```ts
type UserRole = "clinician" | "admin";
```

This does not need real authentication. A role switcher or hardcoded mock role is acceptable.

## Required tasks

### 1. Dashboard controls implementation

The dashboard list/table is already present, but controls are intentionally not wired.

Candidate task:

- Implement **Search**
- Implement **Filter by risk level**
- Implement **Filter by status**
- Implement **Sort by submitted date**

Expected behaviour after implementation:

- Controls change visible list results
- Search works for candidate name, employer, and role title
- Sort direction is applied correctly

### 2. Dashboard pagination implementation

Seed data includes **1000 assessments** with even status distribution.
Starter currently loads full list in one request.

Candidate task:

- Implement paginated list requests
- Add usable pagination UI (next/previous or numbered pages)
- Preserve existing table columns and row navigation

Expected behaviour after implementation:

- Initial dashboard request is paginated
- Switching pages updates list correctly
- Total count/page context is visible

### 3. Assessment detail actions implementation

Assessment detail page is present, but status update and note creation are intentionally disabled.

Candidate task:

- Wire status transition actions
- Wire review note submission
- Handle API validation errors clearly

Expected behaviour after implementation:

- Clinician can perform valid status transitions
- Invalid transitions are blocked with clear message
- Clinician can add review notes (min 5 chars)
- New notes appear on refresh/new fetch

No bonus tasks for this version of the exercise.

## Submission expectations

Please submit:

1. A link to your repository or zip file
2. Setup instructions if you changed anything
3. A short `SUBMISSION_NOTES.md` containing:
   - What you completed
   - What you skipped
   - What you would improve next
   - Any assumptions
   - Time spent

## Running tests during implementation

Use these commands from project root:

```bash
docker compose up -d
docker compose exec -T api python manage.py test assessments -v 2
```

Notes:

- Tests verify API behavior and core workflow expectations.
- In this starter version, some tests are expected to fail until candidate implements required tasks.
- Re-run tests after each milestone to track progress.

## Evaluation rubric

### Frontend quality: 35%

Strong signals:

- Clean layout and visual hierarchy
- Sensible component boundaries
- Good TypeScript usage
- Handles loading/error/empty states
- Clear dashboard and detail workflow
- Responsive enough for real usage

Weak signals:

- Everything in one component
- Poor spacing/alignment
- No error states
- Hardcoded repeated markup
- `any` everywhere
- UI technically works but feels careless

### Full-stack implementation: 25%

Strong signals:

- Sensible REST API design
- Good validation
- Clean Django/DRF structure
- Persistence works
- Errors are handled properly
- Business rules are not only cosmetic

Weak signals:

- No validation
- Broken persistence
- Duplicated business logic everywhere
- Backend accepts invalid transitions
- Unclear API responses

### Product/workflow thinking: 20%

Strong signals:

- Risk and status are easy to understand
- Clinician workflow is clear
- Role restrictions are understandable
- Auditability and traceability are considered
- The UI supports decision-making, not just data display

Weak signals:

- Generic CRUD experience
- Status transitions are confusing
- Admin/clinician roles are ignored
- No sense of real operational use

### Production readiness: 10%

Strong signals:

- Easy to run locally
- Clear README/SUBMISSION_NOTES
- Reasonable env handling
- No obvious security/data leakage mistakes
- Basic tests or test plan

Weak signals:

- Broken setup
- Missing instructions
- Console/runtime errors
- Sensitive data logged unnecessarily

### Communication and judgement: 10%

Strong signals:

- Clear assumptions
- Good prioritisation
- Explains trade-offs
- Does not over-engineer
- Knows what should be improved next

Weak signals:

- No explanation
- Overbuilt but incomplete
- Ignores the timebox
- Cannot explain choices

## Quick smoke test

```bash
docker compose up --build -d
docker compose exec api python manage.py migrate
docker compose exec api python manage.py seed_assessments
curl http://localhost:8000/api/health/
curl http://localhost:8000/api/assessments/
curl http://localhost:8000/api/assessments/1/
open http://localhost:3000
```

### Troubleshooting

- If frontend shows API connection errors, verify compose env values:
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`
   - `NEXT_INTERNAL_API_BASE_URL=http://api:8000/api`
- If API boot fails, wait for Postgres healthcheck to pass, then retry `docker compose up -d`.

A strong candidate does not need to complete every bonus task. For this role, prioritise:

1. Frontend workflow quality
2. Clean TypeScript and component structure
3. Correct status/review-note behaviour
4. Sensible backend validation
5. Ability to explain decisions