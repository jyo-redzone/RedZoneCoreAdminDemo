# Admin Page (React + MUI) — Implementation Spec

**Goal:** Build a responsive **Admin** mock that manages hierarchical entities (Clubs → Sports → Teams → Users and Pitches → Cameras). The same codebase must adapt to **desktop (3‑pane)**, **tablet (2‑pane + drawer)**, and **mobile (drill‑down + bottom sheet)**.

Tech stack: **React 18**, **TypeScript**, **MUI v5/6**, **Zustand** (state), **Zod** (validation), **MSW** or in‑memory fixtures (mock API), **Vite** (build). No server required for the mock.

---

## 1) Project Structure

```
/admin-mock/
  src/
    app/
      App.tsx
      routes.tsx
      theme.ts
    layout/
      ResponsiveLayout.tsx
      DesktopShell.tsx
      TabletShell.tsx
      MobileShell.tsx
      HeaderBar.tsx
      Breadcrumbs.tsx
    features/admin/
      AdminPage.tsx
      components/
        TreeNav.tsx
        EntityList.tsx
        ListToolbar.tsx
        BulkActionBar.tsx
        DetailsPanel.tsx     // desktop/tablet
        DetailsSheet.tsx     // mobile bottom sheet
        CreateEditForm.tsx
        EmptyState.tsx
      hooks/
        useAdminController.ts
        useResponsiveNodePath.ts
      model/
        types.ts
        schemas.ts
      store/
        adminStore.ts
      api/
        adminApi.ts
        fixtures.ts
    shared/
      components/
        ConfirmDialog.tsx
        IconBadge.tsx
      hooks/
        useDebouncedValue.ts
        useKeyboardShortcuts.ts
      utils/
        array.ts
        ids.ts
  index.html
  main.tsx
  vite.config.ts
```

---

## 2) Data Model

### 2.1 Entity Types
```ts
// src/features/admin/model/types.ts
export type Id = string;

export type Role = 'super_admin' | 'tenant_admin' | 'member';

export type EntityKind = 'club' | 'sport' | 'team' | 'user' | 'pitch' | 'camera';

export interface Club { id: Id; name: string; }
export interface Sport { id: Id; clubId: Id; name: string; }
export interface Team { id: Id; sportId: Id; name: string; }
export interface User {
  id: Id;
  teamId: Id;
  name: string;
  email: string;
  role: Exclude<Role, 'super_admin'>;
  status: 'active' | 'invited';
}
export interface Pitch { id: Id; clubId: Id; name: string; }
export interface Camera {
  id: Id;
  pitchId: Id;
  sportContext: 'football' | 'rugby' | 'hockey';
  name?: string;                // Optional custom label
}

export type AnyEntity = Club | Sport | Team | User | Pitch | Camera;
```

### 2.2 Hierarchy Path
```ts
// Represents the current node selection in the tree
export type Path = {
  clubId?: Id;
  sportId?: Id;
  teamId?: Id;
  pitchId?: Id;
};
```

### 2.3 View Model (List Row)
```ts
export interface ListItemVM {
  id: Id;
  primary: string;     // display name
  secondary?: string;  // role/email/status for users; sport for team; etc.
  icon: React.ReactNode;
}
```

---

## 3) Mock API (Swappable)

**Goal:** Start with in‑memory fixtures. Later, can be replaced by real endpoints by editing `adminApi.ts` only.

### 3.1 Functions
```ts
// src/features/admin/api/adminApi.ts
export const adminApi = {
  list(kind: EntityKind, path: Path, query?: string, page=1, pageSize=20): Promise<{items: AnyEntity[]; total: number}>,
  get(kind: EntityKind, id: Id): Promise<AnyEntity>,
  create(kind: EntityKind, payload: Partial<AnyEntity>, path: Path): Promise<AnyEntity>,
  update(kind: EntityKind, id: Id, patch: Partial<AnyEntity>): Promise<AnyEntity>,
  remove(kind: EntityKind, ids: Id[]): Promise<void>,
  inviteUser(payload: {teamId: Id; name: string; email: string; role: 'tenant_admin'|'member'}): Promise<User>,
  changeUserRole(ids: Id[], role: 'tenant_admin'|'member'): Promise<void>,
};
```

### 3.2 Fixtures
- Seed: 2 clubs (Palermo, Lommel)
- Sports: Football under both; (optionally) Rugby/Hockey under another club
- Teams: Men, Ladies, Youth
- Users: 6–10 dummy users
- Pitches: 2 per club (Main, Training)
- Cameras: 1–2 per pitch

---

## 4) State Management (Zustand)

### 4.1 Store Shape
```ts
// src/features/admin/store/adminStore.ts
import { create } from 'zustand';

export type AdminKind = 'users' | 'teams' | 'pitches' | 'cameras';

type AdminState = {
  path: Path;                              // current tree node
  kind: AdminKind;                         // active list type (tab context)
  items: ListItemVM[];                     // list data (mapped from entities)
  total: number;
  selection: Id[];                         // checked rows
  query: string;
  page: number;
  pageSize: number;
  detailsOpen: boolean;
  currentId?: Id;                          // item opened in details

  // actions
  setPath(path: Partial<Path>): void;
  setKind(kind: AdminKind): void;
  setSelection(ids: Id[]): void;
  setQuery(q: string): void;
  setPaging(page: number, pageSize?: number): void;
  openDetails(id: Id): void;
  closeDetails(): void;

  // data ops
  load(): Promise<void>;
  save(patch: Partial<AnyEntity>): Promise<void>;
  create(kind: EntityKind, payload: Partial<AnyEntity>): Promise<void>;
  remove(ids: Id[]): Promise<void>;
  bulkChangeRole(ids: Id[], role: 'tenant_admin'|'member'): Promise<void>;
};
```

### 4.2 Derived Values
- `breadcrumbs` from `path`
- `isLargeScreen` from `useMediaQuery`
- `hasSelection` from `selection.length > 0`

---

## 5) Responsive Layout

### 5.1 Breakpoints
- **Desktop**: `min-width: 1200px` → **3 panes**: Tree | List | Details (fixed)
- **Tablet**: `768px–1199px` → **2 panes**: Tree | List + Details **drawer** overlay
- **Mobile**: `max-width: 767px` → **drill‑down** views; Details as **bottom sheet**

### 5.2 Shells
- `ResponsiveLayout.tsx` chooses shell by `useMediaQuery` and renders identical children in different regions.
- All shells render the same feature components (TreeNav, EntityList, DetailsPanel/Sheet) arranged differently.

---

## 6) Feature Components (Props & Behavior)

### 6.1 `TreeNav.tsx`
- **Purpose:** Navigate hierarchy (Clubs → Sports → Teams; Pitches → Cameras)
- **Props:**
  ```ts
  type TreeNavProps = {
    path: Path;
    onSelectNode(next: Partial<Path>): void;
    filter?: string; // optional search string within tree
  }
  ```
- **Behavior:**
  - Collapsible nodes, icons per entity type
  - Shows counts (badge) for children (optional)
  - Click sets `path` and triggers list reload

### 6.2 `EntityList.tsx`
- **Purpose:** List rows with checkbox selection, sort, pagination
- **Props:**
  ```ts
  type EntityListProps = {
    kind: AdminKind;
    items: ListItemVM[];
    selection: Id[];
    onRowClick(id: Id): void;
    onSelectionChange(ids: Id[]): void;
    toolbar?: React.ReactNode;   // ListToolbar
    bulkBar?: React.ReactNode;   // BulkActionBar (visible when selection)
    loading?: boolean;
    total?: number; page?: number; pageSize?: number;
    onPageChange?(page: number): void;
  }
  ```
- **Row actions:** `⋮` menu: Edit, Rename, Move, Remove
- **Selection:** [All] / [None] helper, shift‑range select on desktop

### 6.3 `ListToolbar.tsx`
- Search input (debounced), quick filters (Role, Status), counter (e.g., “3 selected”)

### 6.4 `BulkActionBar.tsx`
- Sticky bar when `selection.length > 0`: **Change Role**, **Remove**, **Move**
- Confirmation via `ConfirmDialog`

### 6.5 `DetailsPanel.tsx` (desktop/tablet)
- Right drawer (desktop fixed; tablet overlays list)
- **Props:** `{ open, entity, onClose, onSave }`
- Hosts `CreateEditForm` based on entity kind

### 6.6 `DetailsSheet.tsx` (mobile)
- Bottom sheet (MUI `Dialog` with slide‑up transition)
- Same props contract as `DetailsPanel`

### 6.7 `CreateEditForm.tsx`
- **Props:**
  ```ts
  type CreateEditFormProps = {
    kind: EntityKind;
    value: AnyEntity | Partial<AnyEntity>;
    onChange(patch: Partial<AnyEntity>): void;
    onSubmit(): void;
    readOnly?: boolean;
  }
  ```
- **Fields:**
  - **User:** name, email, role (select), status (read‑only)
  - **Team:** name, sport (select)
  - **Pitch:** name, club (select)
  - **Camera:** pitch (select), sportContext (select), name (optional)
- **Validation:** via `zod` schemas in `schemas.ts`

### 6.8 `EmptyState.tsx`
- Role‑aware messages + CTA (e.g., “No cameras yet — Add Camera”)

---

## 7) Header & Navigation

### 7.1 `HeaderBar.tsx`
- Left: App title + `Breadcrumbs`
- Right: Profile menu (Avatar → Profile, Logout)
- Global search (optional): toggles a dialog; otherwise search is scoped in `ListToolbar`

### 7.2 `Breadcrumbs.tsx`
- Built from `path` (Club / Sport / Team or Club / Pitch)
- Clickable crumbs allow jumping up hierarchy; on mobile acts as back button

---

## 8) Interactions & Flows

### 8.1 Create Entity
1. Click **Add (⊕)** in list toolbar (contextual to `kind`)
2. Drawer/sheet opens with `CreateEditForm`
3. Validate & Save → show snackbar; list refreshes and selects new row; keep details open

### 8.2 Edit Entity
- Row click → open details with current values; inline auto‑save on blur + explicit Save/Cancel for safety

### 8.3 Bulk Actions
- Select multiple rows → sticky `BulkActionBar` appears
- Run **Change Role** (for users) / **Remove** (common)
- Show confirm dialog + snackbar with **Undo** (mock by snapshotting store)

### 8.4 Search & Filters
- Debounced search (300ms) scoped to current node; optional toggle to “Search tenant”
- Quick filters for Users: Role (Admin/Member), Status (Active/Invited)

---

## 9) Theming & Visual System

- **MUI Theme** in `app/theme.ts`
  - Semantic colors (soft, accessible):
    - club → `info.main`
    - sport → `success.main`
    - team → `warning.main`
    - user → `error.main`
    - camera → `secondary.main`
- 8px spacing grid; 44px min touch targets; focus outlines enabled

---

## 10) Accessibility

- Tree: `aria-expanded`, keyboard arrows to navigate, `Enter` to select
- Details panel: focus trap, `aria-labelledby`
- Lists: proper table semantics (or `role=list` + `aria-label`)
- Dialogs: restore focus on close

---

## 11) Keyboard Shortcuts (desktop)

- `Ctrl+N`: Create new
- `Del`: Remove selected
- `F`: Focus search
- `←/→`: Collapse/expand tree nodes

---

## 12) Testing (light)

- Cypress/Playwright smoke flows:
  1. Navigate → select team → open Users → edit user → save → toast
  2. Multi‑select users → bulk change role → verify updated
- RTL unit tests for `useAdminController` and zod validation

---

## 13) Implementation Milestones

**M1 – Skeleton & State**
- Responsive shells + Header + Breadcrumbs
- TreeNav with fixtures
- EntityList (no actions)
- Zustand store with `path/kind/query/selection`

**M2 – Details & Forms**
- DetailsPanel (desktop/tablet), DetailsSheet (mobile)
- CreateEditForm (User + Team)
- Mock API (fixtures) + load/save

**M3 – CRUD & Bulk**
- Invite user, Edit role, Delete user
- Bulk role change, bulk remove
- Undo snackbar

**M4 – Polishing**
- Search, filters, pagination
- Pitch & Camera entities
- Empty states + error banners + a11y pass

---

## 14) Example Snippets

### 14.1 `ResponsiveLayout.tsx`
```tsx
import { useMediaQuery } from '@mui/material';
import DesktopShell from './DesktopShell';
import TabletShell from './TabletShell';
import MobileShell from './MobileShell';

export const ResponsiveLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const desktop = useMediaQuery('(min-width:1200px)');
  const tablet  = useMediaQuery('(min-width:768px) and (max-width:1199px)');
  if (desktop) return <DesktopShell>{children}</DesktopShell>;
  if (tablet)  return <TabletShell>{children}</TabletShell>;
  return <MobileShell>{children}</MobileShell>;
};
```

### 14.2 `AdminPage.tsx` (glue)
```tsx
export default function AdminPage() {
  const ctl = useAdminController();
  return (
    <ResponsiveLayout>
      <HeaderBar breadcrumbs={ctl.breadcrumbs} />
      <TreeNav path={ctl.path} onSelectNode={ctl.setPath} />
      <EntityList
        kind={ctl.kind}
        items={ctl.items}
        selection={ctl.selection}
        onRowClick={ctl.openDetails}
        onSelectionChange={ctl.setSelection}
        toolbar={<ListToolbar query={ctl.query} onQueryChange={ctl.setQuery} />}
        bulkBar={<BulkActionBar onBulkAction={ctl.runBulkAction} />}
      />
      <DetailsPanel
        open={ctl.detailsOpen && ctl.isLargeScreen}
        entity={ctl.currentEntity}
        onClose={ctl.closeDetails}
        onSave={ctl.saveEntity}
      />
      <DetailsSheet
        open={ctl.detailsOpen && !ctl.isLargeScreen}
        entity={ctl.currentEntity}
        onClose={ctl.closeDetails}
        onSave={ctl.saveEntity}
      />
    </ResponsiveLayout>
  );
}
```

### 14.3 Store Skeleton
```ts
export const useAdminStore = create<AdminState>((set, get) => ({
  path: {}, kind: 'users', items: [], total: 0,
  selection: [], query: '', page: 1, pageSize: 20,
  detailsOpen: false,

  setPath: (next) => set((s) => ({ path: { ...s.path, ...next }, page: 1 })),
  setKind: (kind) => set({ kind, page: 1 }),
  setSelection: (ids) => set({ selection: ids }),
  setQuery: (q) => set({ query: q, page: 1 }),
  setPaging: (page, pageSize) => set({ page, pageSize: pageSize ?? get().pageSize }),
  openDetails: (id) => set({ detailsOpen: true, currentId: id }),
  closeDetails: () => set({ detailsOpen: false, currentId: undefined }),

  load: async () => { /* call adminApi.list → map to ListItemVM */ },
  save: async (patch) => { /* adminApi.update → refresh */ },
  create: async (kind, payload) => { /* adminApi.create → refresh/select */ },
  remove: async (ids) => { /* adminApi.remove → refresh */ },
  bulkChangeRole: async (ids, role) => { /* adminApi.changeUserRole */ },
}));
```

### 14.4 Zod Schemas
```ts
export const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['tenant_admin','member']),
});
```

---

## 15) Acceptance Criteria (for the mock)

1. **Responsive shells** switch automatically at breakpoints; no layout glitches.
2. **TreeNav** updates list based on selection; breadcrumbs reflect path.
3. **EntityList**: selection, bulk bar, row menu, pagination, search (debounced).
4. **Details**: opens from row click; editing user name/email/role works; Save and Undo toasts appear.
5. **Create**: add a user/team/pitch/camera from the current context; list refreshes and selects new item.
6. **A11y**: focus management in dialogs/sheets; keyboard navigation in the tree; visible focus rings.

---

## 16) Nice‑to‑Have (stretch)
- Draggable splitter between panes (desktop)
- Global search across tenant (modal)
- Role‑aware empty states & guardrails
- Import/Export (CSV) for users

---

**Notes for the AI coding assistant:**
- Prefer function components + hooks. No class components.
- Keep business logic inside `useAdminController` and the Zustand store.
- Keep components presentational and typed via explicit props.
- Keep CSS minimal; rely on MUI `sx`/system.
- Implement fixtures first; wire to store; then add mutations.

