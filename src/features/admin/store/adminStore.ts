import { create } from 'zustand';
import { adminApi } from '../api/adminApi';
import { AdminKind, AnyEntity, EntityKind, Id, ListItemVM, Path } from '../model/types';

type AdminState = {
  // Navigation state
  path: Path;
  kind: AdminKind;

  // List state
  items: ListItemVM[];
  total: number;
  selection: Id[];
  query: string;
  page: number;
  pageSize: number;

  // Details state
  detailsOpen: boolean;
  currentId?: Id;
  focusedId?: Id;

  // Drawer state
  drawerOpen: boolean;

  // Loading state
  loading: boolean;
  error?: string;

  // Actions
  setPath: (path: Partial<Path>) => void;
  setKind: (kind: AdminKind) => void;
  setSelection: (ids: Id[]) => void;
  setQuery: (query: string) => void;
  setPaging: (page: number, pageSize?: number) => void;
  openDetails: (id: Id) => void;
  closeDetails: () => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setFocusedId: (id?: Id) => void;

  // Data operations
  load: () => Promise<void>;
  save: (patch: Partial<AnyEntity>) => Promise<void>;
  create: (kind: EntityKind, payload: Partial<AnyEntity>) => Promise<void>;
  remove: (ids: Id[]) => Promise<void>;
  bulkChangeRole: (ids: Id[], role: 'tenant_admin' | 'member') => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  path: {},
  kind: 'home',
  items: [],
  total: 0,
  selection: [],
  query: '',
  page: 1,
  pageSize: 20,
  detailsOpen: false,
  focusedId: undefined,
  drawerOpen: false,
  loading: false,

  // Actions
  setPath: (nextPath) =>
    set((state) => {
      // Completely replace path with new path (no lingering IDs)
      const newPath: Path = { ...nextPath } as Path;

      // Derive kind from path level
      let kind: AdminKind;
      if (newPath.userId) {
        kind = 'users'; // At user level, show user details
      } else if (newPath.cameraId) {
        kind = 'cameras'; // At camera level, show camera details
      } else if (newPath.teamId) {
        kind = 'users'; // At team level, show users list
      } else if (newPath.sportId) {
        kind = 'teams'; // At sport level, show teams list
      } else if (newPath.pitchId) {
        kind = 'cameras'; // At pitch level, show cameras list
      } else if (newPath.pitchesRoot) {
        kind = 'pitches'; // At pitches root, show pitches list
      } else if (newPath.clubId) {
        kind = 'sports'; // At club level, show sports list
      } else {
        kind = 'home'; // At root level, show combined clubs and pitches list
      }

      // Check if we're navigating to a parent level (fewer path components)
      const currentPathDepth = Object.keys(state.path).length;
      const newPathDepth = Object.keys(newPath).length;
      const isNavigatingToParent = newPathDepth < currentPathDepth;
      const isNavigatingWithinSameDepth = newPathDepth === currentPathDepth;

      // Auto-close details when navigating to parent level
      const shouldCloseDetails = isNavigatingToParent && state.detailsOpen;
      const shouldPreserveCurrentId = !isNavigatingToParent;

      const result = {
        ...state,
        path: newPath,
        kind,
        page: 1, // Reset to first page when changing path
        selection: [], // Clear selection when changing path
        detailsOpen: shouldCloseDetails ? false : state.detailsOpen,
        currentId: shouldPreserveCurrentId ? state.currentId : undefined,
        focusedId: undefined, // Clear focused item when navigating
      };
      return result;
    }),

  setKind: (kind) => set({ kind, page: 1 }),

  setSelection: (ids) => set({ selection: ids }),

  setQuery: (query) => set({ query, page: 1 }),

  setPaging: (page, pageSize) =>
    set((state) => ({
      page,
      pageSize: pageSize ?? state.pageSize,
    })),

  openDetails: (id) => set({ detailsOpen: true, currentId: id }),

  closeDetails: () => set({ detailsOpen: false, currentId: undefined }),

  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

  closeDrawer: () => set({ drawerOpen: false }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setFocusedId: (id) => set({ focusedId: id }),

  // Data operations
  load: async () => {
    const state = get();
    set((state) => ({ ...state, loading: true, error: undefined }));

    try {
      const { items, total } = await adminApi.list(
        state.kind === 'home'
          ? 'home'
          : state.kind === 'users'
            ? 'user'
            : state.kind === 'teams'
              ? 'team'
              : state.kind === 'pitches'
                ? 'pitch'
                : state.kind === 'cameras'
                  ? 'camera'
                  : state.kind === 'sports'
                    ? 'sport'
                    : 'club',
        state.path,
        state.query,
        state.page,
        state.pageSize,
      );

      // Map entities to ListItemVM
      const listItems: ListItemVM[] = items.map((item) => {
        let secondary: string | undefined;
        if ('email' in item) {
          secondary = item.email;
        } else if ('role' in item) {
          secondary = item.role as string;
        } else if ('type' in item && item.type === 'category') {
          secondary = 'Category';
        } else if ('sportId' in item) {
          secondary = 'Team';
        } else if ('pitchId' in item) {
          secondary = 'Broadcast: Football; Tactical: Football Tactical';
        } else if ('clubId' in item) {
          secondary = 'Sport';
        } else {
          // This is a club (no clubId, sportId, pitchId, etc.)
          secondary = 'Club';
        }

        return {
          id: item.id,
          primary: 'name' in item ? item.name || 'Unknown' : 'Unknown',
          secondary,
          icon: null as React.ReactNode, // Will be set by components
        };
      });

      set((state) => ({ ...state, items: listItems, total, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: error instanceof Error ? error.message : 'Failed to load data', loading: false }));
    }
  },

  save: async (patch) => {
    const state = get();
    if (!state.currentId) return;

    set({ loading: true, error: undefined });

    try {
      const entityKind =
        state.kind === 'users'
          ? 'user'
          : state.kind === 'teams'
            ? 'team'
            : state.kind === 'pitches'
              ? 'pitch'
              : 'camera';

      await adminApi.update(entityKind, state.currentId, patch);
      await state.load(); // Refresh the list
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save changes',
        loading: false,
      });
    }
  },

  create: async (kind, payload) => {
    const state = get();
    set({ loading: true, error: undefined });

    try {
      await adminApi.create(kind, payload, state.path);
      await state.load(); // Refresh the list
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create item',
        loading: false,
      });
    }
  },

  remove: async (ids) => {
    const state = get();
    set({ loading: true, error: undefined });

    try {
      const entityKind =
        state.kind === 'users'
          ? 'user'
          : state.kind === 'teams'
            ? 'team'
            : state.kind === 'pitches'
              ? 'pitch'
              : 'camera';

      await adminApi.remove(entityKind, ids);
      await state.load(); // Refresh the list
      set({ loading: false, selection: [] });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove items',
        loading: false,
      });
    }
  },

  bulkChangeRole: async (ids, role) => {
    set({ loading: true, error: undefined });

    try {
      await adminApi.changeUserRole(ids, role);
      await get().load(); // Refresh the list
      set({ loading: false, selection: [] });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to change roles',
        loading: false,
      });
    }
  },
}));
