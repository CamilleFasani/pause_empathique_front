# Front-end Instructions — Vue 3 and TypeScript

These instructions extend the workspace root `AGENTS.md` for all work in this
repository.

## Role of the SPA

This repository is the Vue 3 and TypeScript SPA progressively replacing Django
templates. It consumes the versioned DRF API from the sibling back-end repository.
The API remains the authority for validation, authorization, persistence, and
business invariants. The SPA owns presentation, accessible interactions,
navigation, and client-side state.

Use `pause_empathique/docs/` in the sibling repository as the source of truth for
the shared roadmap and session tracking. Do not create duplicate project-management
or session-log files here.

## Vue architecture

- Use the Composition API with `<script setup lang="ts">` and follow existing
  project conventions.
- Keep components focused on rendering, local UI state, emitted events, and user
  interaction. Extract reusable stateful behavior to composables.
- Keep views responsible for page composition and route-level coordination. Keep
  layouts responsible for shared page structure.
- Use Pinia stores for shared application state and workflows such as
  authentication. Handle and log operation errors in the store or API layer that
  owns the request; components should display safe, user-oriented UI state.
- Centralize HTTP configuration in `src/api/`. Do not scatter raw Axios setup,
  base URLs, token handling, or response normalization across components.
- Use Vue Router for navigation and route metadata/guards. Do not implement guards
  before the authentication lifecycle and failure behavior are defined.
- Centralize gender-label resolution in the planned `useGender()` composable. Do
  not duplicate gender-selection logic across components.
- Prefer small, explicit components and composables over premature generic
  abstractions.

## TypeScript and API contracts

- Keep strict, meaningful types at API, store, composable, props, and emits
  boundaries. Avoid `any`; narrow `unknown` errors safely.
- Model API response and error shapes deliberately. Do not assume a successful
  payload when status or fields can vary.
- Keep front-end types aligned with the documented OpenAPI contract. When a shape
  mismatch appears, determine whether the contract or the integration is wrong
  instead of adding casts that hide it.
- Environment variables exposed by Vite are public. Never put secrets or private
  credentials in `VITE_*` variables or client code.

## Authentication and security

- Treat the JWT storage/transport choice as an explicit architecture decision with
  XSS, CSRF, refresh, logout, and expiry trade-offs documented before
  implementation.
- Centralize token attachment, refresh coordination, and authentication failures.
  Avoid refresh loops and duplicate concurrent refresh attempts.
- Front-end route guards and validation improve UX but are not authorization. The
  API must independently reject forbidden operations.
- Do not render raw untrusted HTML. Minimize sensitive data kept in persistent
  browser storage and clear authentication state consistently on logout or terminal
  refresh failure.

## User experience and accessibility

- Implement semantic HTML and keyboard behavior before detailed styling.
- Associate labels and errors with form controls, provide visible focus states,
  and make loading, empty, success, and error states understandable.
- Preserve the established design tokens and Tailwind v4 approach. Reuse existing
  components and assets before adding variants or dependencies.
- Build responsive behavior intentionally and verify at representative mobile and
  desktop widths.
- Keep user-facing French copy consistent, inclusive, and understandable.

## Tests and quality

- For each change, decide the proportionate verification: TypeScript checking,
  linting, build, and focused automated tests when a test framework covers the
  behavior.
- Test business-relevant stores/composables and critical interactions rather than
  implementation details. Add a regression test for reproducible bugs when
  practical.
- Run `npm run type-check`, `npm run lint`, and `npm run build` for meaningful
  integration changes, or explain any command that could not be run.
- Do not silence TypeScript or ESLint errors with broad exclusions or unsafe casts.

When a UI feature needs an endpoint or contract change, stop at the API boundary,
define the back-end requirement, and coordinate the change through the shared
cross-repository workflow.
