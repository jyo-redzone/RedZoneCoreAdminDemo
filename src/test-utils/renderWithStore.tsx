import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AdminKind, Path } from '../features/admin/model/types';
import { useAdminStore } from '../features/admin/store/adminStore';
import { SnackbarProvider } from '../shared/components/SnackbarProvider';

// Create a test theme
const testTheme = createTheme();

// Mock store state for testing
interface MockStoreState {
    path?: Path;
    kind?: AdminKind;
    items?: any[];
    total?: number;
    selection?: string[];
    detailsOpen?: boolean;
    currentId?: string;
    focusedId?: string;
    drawerOpen?: boolean;
    loading?: boolean;
    error?: string;
}

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider theme={testTheme}>
            <SnackbarProvider>
                {children}
            </SnackbarProvider>
        </ThemeProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & {
        initialStoreState?: MockStoreState;
    }
) => {
    const { initialStoreState, ...renderOptions } = options || {};

    // Set initial store state if provided
    if (initialStoreState) {
        const store = useAdminStore.getState();
        store.setPath(initialStoreState.path || {});
        if (initialStoreState.kind) store.setKind(initialStoreState.kind);
        if (initialStoreState.selection) store.setSelection(initialStoreState.selection);
        if (initialStoreState.detailsOpen !== undefined) {
            if (initialStoreState.detailsOpen) {
                store.openDetails(initialStoreState.currentId || 'test-id');
            } else {
                store.closeDetails();
            }
        }
        if (initialStoreState.focusedId) store.setFocusedId(initialStoreState.focusedId);
        if (initialStoreState.drawerOpen !== undefined) {
            if (initialStoreState.drawerOpen) {
                store.toggleDrawer();
            }
        }
    }

    return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Navigation helpers
const navigationHelpers = {
    // Click breadcrumb by index
    clickBreadcrumb: async (container: HTMLElement, index: number) => {
        const breadcrumbs = container.querySelectorAll('[aria-label="breadcrumb"] a');
        if (breadcrumbs[index]) {
            await (breadcrumbs[index] as HTMLElement).click();
        }
    },

    // Click tree node by data-testid
    clickTreeNode: async (container: HTMLElement, nodeId: string) => {
        const node = container.querySelector(`[data-testid="tree-node-${nodeId}"]`);
        if (node) {
            await (node as HTMLElement).click();
        }
    },

    // Click entity row by data-testid
    clickEntityRow: async (container: HTMLElement, rowId: string) => {
        const row = container.querySelector(`[data-testid="entity-row-${rowId}"]`);
        if (row) {
            await (row as HTMLElement).click();
        }
    },

    // Navigate to specific path programmatically
    navigateToPath: (path: Path) => {
        const store = useAdminStore.getState();
        store.setPath(path);
    },
};

// Assertion helpers
const assertionHelpers = {
    // Assert breadcrumb depth (count only breadcrumb items, not separators)
    assertBreadcrumbDepth: (container: HTMLElement, expectedDepth: number) => {
        const breadcrumbs = container.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])');
        expect(breadcrumbs).toHaveLength(expectedDepth);
    },

    // Assert path state
    assertPathState: (expectedPath: Path) => {
        const store = useAdminStore.getState();
        expect(store.path).toEqual(expectedPath);
    },

    // Assert kind state
    assertKindState: (expectedKind: AdminKind) => {
        const store = useAdminStore.getState();
        expect(store.kind).toBe(expectedKind);
    },

    // Assert details panel state
    assertDetailsOpen: (expectedOpen: boolean) => {
        const store = useAdminStore.getState();
        expect(store.detailsOpen).toBe(expectedOpen);
    },

    // Assert breadcrumb labels (get only breadcrumb items, not separators)
    assertBreadcrumbLabels: (container: HTMLElement, expectedLabels: string[]) => {
        const breadcrumbs = container.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])');
        const actualLabels = Array.from(breadcrumbs).map(el => el.textContent?.trim());
        expect(actualLabels).toEqual(expectedLabels);
    },

    // Assert focused ID
    assertFocusedId: (expectedId?: string) => {
        const store = useAdminStore.getState();
        expect(store.focusedId).toBe(expectedId);
    },

    // Assert selection state
    assertSelection: (expectedSelection: string[]) => {
        const store = useAdminStore.getState();
        expect(store.selection).toEqual(expectedSelection);
    },
};

// Mock data helpers based on fixtures
const mockData = {
    clubs: [
        { id: 'club-1', name: 'Palermo' },
        { id: 'club-2', name: 'Lommel' },
    ],
    sports: [
        { id: 'sport-1', clubId: 'club-1', name: 'Football' },
        { id: 'sport-2', clubId: 'club-1', name: 'Rugby' },
        { id: 'sport-3', clubId: 'club-1', name: 'Hockey' },
        { id: 'sport-4', clubId: 'club-2', name: 'Football' },
        { id: 'sport-5', clubId: 'club-2', name: 'Basketball' },
    ],
    teams: [
        { id: 'team-1', sportId: 'sport-1', name: "Men's First Team" },
        { id: 'team-2', sportId: 'sport-1', name: "Ladies' Team" },
        { id: 'team-5', sportId: 'sport-2', name: 'Senior Rugby' },
        { id: 'team-9', sportId: 'sport-4', name: 'First Team' },
        { id: 'team-12', sportId: 'sport-5', name: 'Senior Basketball' },
    ],
    users: [
        { id: 'user-1', teamId: 'team-1', name: 'Marco Rossi', email: 'marco.rossi@fcPalermo.it', role: 'tenant_admin', status: 'active' },
        { id: 'user-2', teamId: 'team-1', name: 'Giuseppe Bianchi', email: 'giuseppe.bianchi@fcPalermo.it', role: 'member', status: 'active' },
    ],
    pitches: [
        { id: 'pitch-1', clubId: 'club-1', name: 'Main Stadium' },
        { id: 'pitch-2', clubId: 'club-1', name: 'Training Ground A' },
        { id: 'pitch-4', clubId: 'club-2', name: 'Stadion Soeverein' },
    ],
    cameras: [
        { id: 'camera-1', pitchId: 'pitch-1', sportContext: 'football', name: 'Main Stadium Camera 1' },
        { id: 'camera-2', pitchId: 'pitch-1', sportContext: 'football', name: 'Main Stadium Camera 2' },
    ],
};

// Re-export everything
export * from '@testing-library/react';
export { assertionHelpers, mockData, navigationHelpers, customRender as render };

