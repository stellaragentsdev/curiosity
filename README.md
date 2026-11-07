# Curiosity — RCM Learning & Performance Intelligence (Prototype)

Front-end **demo/prototype** of an RCM (revenue cycle management) learning & performance dashboard: associate, trainer and admin views, NHT and client-specific training, SOP playbooks, defect/BQT/PIP tracking and a "Trainer Sam" assistant.

Stack: React 18, TypeScript, Vite, Tailwind CSS. No backend.

## Getting started

```bash
npm ci
npm run dev      # local dev server
npm test         # unit tests (vitest)
npm run build    # type-check + production build
```

CI (proposed, not yet committed: needs a token with `workflow` scope) should run `npm ci`, `npm test` and `npm run build` on pushes to `main` and on pull requests.

## Important limitations

- **Demo data only.** All data comes from hard-coded mock data (`src/data/mockRcmData.ts` and initial constants in components) held in React state. Do not enter real employee, patient or medical data.
- **No persistence.** Nothing is saved; uploads, enrolments and governance changes are lost on page reload. The app does not use `localStorage`, `sessionStorage`, cookies, or any network/database calls.
- **No authentication or authorization.** The "login role" / persona selector (`src/App.tsx` `handleSelectPersona`, `src/components/InteractiveTreeTileAndDbHub.tsx` `loginRole`) is a client-side UI switch. Role checks only hide/show UI and can be bypassed by anyone with the browser. They are **not** a security control.
- **"Trainer Sam AI" is not AI.** `src/utils/rcmAiAssistant.ts` returns canned text chosen by keyword rules. Answers are labelled `[DEMO]` and are **not verified billing, coding or compliance policy**; citations refer to sample SOP names.

Moving to production needs an architectural decision on a backend, identity provider/SSO, server-side role enforcement, audit logging and a HIPAA-appropriate data store. None of these is chosen here.
