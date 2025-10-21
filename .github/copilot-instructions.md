<!-- .github/copilot-instructions.md - Hand-crafted for this repo -->
# Guidance for AI coding agents — Admin Mock (React + TS + MUI + Zustand + Zod)

Keep this short and actionable. Use the repository's existing conventions (`.cursorrules` and `README.md`) as the source of truth.

Key facts
- Stack: React 18, TypeScript, Vite, pnpm, Material‑UI (MUI), Zustand for state, Zod for validation.
- Purpose: responsive admin UI to manage hierarchical entities (Clubs → Sports → Teams → Users; Pitches → Cameras).

Where to look
- App entry & theme: `src/app/` (e.g. `App.tsx`, `theme.ts`).
- Layout shells: `src/layout/` — `ResponsiveLayout.tsx`, `DesktopShell.tsx`, `TabletShell.tsx`, `MobileShell.tsx`.
- Admin feature: `src/features/admin/` — `api/` (adminApi.ts, fixtures.ts), `components/`, `hooks/`, `model/` (schemas/types), `store/` (Zustand store).
- Shared utilities & hooks: `src/shared/` (hooks like `useDebouncedValue`, components like `ConfirmDialog` and `SnackbarProvider`).

Build / test / dev commands (use pnpm)
- Install: `pnpm install`
- Dev server: `pnpm dev` (Vite, default localhost:5173)
- Build: `pnpm build`
- Preview: `pnpm preview`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` / `pnpm lint:fix`
- Format: `pnpm format` / `pnpm format:check`

Architecture & patterns to follow
- Keep UI (presentation) and logic separated: UI in `components/`, business logic in `hooks/` and `store/`.
- Centralized state: `features/admin/store/adminStore.ts` (use `useAdminStore(selector)` to avoid re-renders).
- Controller hook: `useAdminController.ts` orchestrates store ↔ api interactions; put async side effects there or in the store — not inside presentational components.
- API layer: `features/admin/api/adminApi.ts` wraps in-memory `fixtures.ts`. All CRUD flows go through this API.
- Validation: Zod schemas in `features/admin/model/schemas.ts` — forms must validate against these and surface friendly messages.
- Responsive behavior: layout shells decide panes; feature components should not branch on breakpoint.

Conventions and small rules (concrete)
- Use functional React components with explicit prop interfaces. Avoid `any` and implicit any types.
- Name boolean props/state `isX`, `hasX`, `canX`. Name actions `setX`, `openX`, `closeX`, `load`, `save`, `create`, `remove`.
- Keep components ~200 lines max and keep async calls out of UI.
- Use MUI `sx` or theme tokens for styling; prefer built-in MUI components (List, Table, Drawer, Dialog, FAB, Snackbar).
- Selection & pagination: List components should expose props like `items, selection, onSelectionChange, total, page, pageSize, onPageChange` and not fetch data themselves.
- Accessibility: provide `aria-label` on icon buttons, preserve focus outlines, and ensure keyboard navigation works for tree/list (arrow keys, Enter, Esc).

Examples (copyable guidance for implementers)
- "Create `features/admin/components/EntityList.tsx` using an MUI Table. Props: `kind, items, selection, onRowClick, onSelectionChange, toolbar, bulkBar, loading, total, page, pageSize, onPageChange`. Implement checkbox selection, pagination, and a row action menu. Do not fetch data." 
- "Implement `useAdminController.ts` to map `adminStore` and `adminApi` into view models (ListItemVM), breadcrumbs, and actions: `openDetails(id)`, `closeDetails()`, `save(payload)`, `create(kind,payload)`, `remove(ids)`, `bulkChangeRole(ids, role)`." 

Quality gates (what to verify)
- Project builds: `pnpm build` or `tsc --noEmit` pass without type errors.
- No `any` in new code. Keep lint warnings to zero where possible.
- Responsive check: desktop/tablet/mobile arrangement works using `ResponsiveLayout`.
- Forms use Zod schemas and show validation messages.

What *not* to change without human review
- Global layout behavior in `src/layout/ResponsiveLayout.tsx` and shell implementations — these encode UX assumptions.
- `features/admin/store/*` shape — reshaping the store requires updating many selectors and tests.

If you need to add tests
- Add unit tests alongside code in `__tests__` directories under feature folders. See `src/features/admin/__tests__/` for examples.

If you need more context
- Read `README.md` and `.cursorrules` (both in repo root) — they contain detailed rules and examples.

Keep this file short. Ask for clarification if a change touches layout shells or the store shape.
