import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assertionHelpers, render as customRender, mockData } from '../../../test-utils/renderWithStore';
import { AdminPage } from '../AdminPage';
import { useAdminStore } from '../store/adminStore';

// Mock the adminApi to return mock data
jest.mock('../api/adminApi', () => ({
    adminApi: {
        list: jest.fn().mockImplementation(async (kind, path, query, page, pageSize) => {
            // Return appropriate mock data based on kind and path
            if (kind === 'club') {
                return { items: mockData.clubs, total: mockData.clubs.length };
            } else if (kind === 'sport') {
                return { items: mockData.sports.filter(s => s.clubId === path.clubId), total: 1 };
            } else if (kind === 'team') {
                return { items: mockData.teams.filter(t => t.sportId === path.sportId), total: 1 };
            } else if (kind === 'user') {
                return { items: mockData.users.filter(u => u.teamId === path.teamId), total: 2 };
            } else if (kind === 'pitch') {
                if (path.pitchesRoot) {
                    return { items: mockData.pitches, total: mockData.pitches.length };
                }
                return { items: [], total: 0 };
            } else if (kind === 'camera') {
                return { items: mockData.cameras.filter(c => c.pitchId === path.pitchId), total: 2 };
            }
            return { items: [], total: 0 };
        }),
        update: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
        remove: jest.fn().mockResolvedValue({}),
        changeUserRole: jest.fn().mockResolvedValue({}),
    },
}));

// Helper to click an element from EntityList when there are multiple matches
const clickEntityListItem = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
    const elements = screen.getAllByText(text);
    const element = elements.find(el =>
        el.closest('[data-testid="entity-list"]') ||
        el.closest('.MuiTableBody-root')
    ) || elements[0];
    if (element) {
        await user.click(element);
    }
};

describe('AdminPage Navigation Integration Tests', () => {
    beforeEach(() => {
        // Reset store state before each test
        const store = useAdminStore.getState();
        store.setPath({});
        store.setKind('clubs');
        store.closeDetails();
        store.setSelection([]);
        store.setFocusedId(undefined);
    });

    describe('Part 1: Sequential Navigation', () => {
        it('should navigate Root → Club → Sport → Team → User with correct breadcrumb depth', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Step 1: Start at Root
            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 1);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home']);
                assertionHelpers.assertPathState({});
                assertionHelpers.assertKindState('clubs');
            });

            // Step 2: Click "Palermo" in EntityList (get the first one from EntityList)
            await clickEntityListItem(user, 'Palermo');

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 2);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo']);
                assertionHelpers.assertPathState({ clubId: 'club-1' });
                assertionHelpers.assertKindState('sports');
            });

            // Step 3: Click "Football" in EntityList (get the first one from EntityList)
            await clickEntityListItem(user, 'Football');

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 3);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football']);
                assertionHelpers.assertPathState({ clubId: 'club-1', sportId: 'sport-1' });
                assertionHelpers.assertKindState('teams');
            });

            // Step 4: Click "Men\'s First Team" in EntityList
            const teamRow = screen.getByText("Men's First Team");
            await user.click(teamRow);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 4);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football', "Men's First Team"]);
                assertionHelpers.assertPathState({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
                assertionHelpers.assertKindState('users');
            });

            // Step 5: Click a user in EntityList (should open details, breadcrumb unchanged)
            const userRow = screen.getByText('Marco Rossi');
            await user.click(userRow);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 5); // Should show user name
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football', "Men's First Team", 'Marco Rossi']);
                assertionHelpers.assertPathState({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' }); // Should include userId
                assertionHelpers.assertDetailsOpen(true);
            });
        });

        it('should navigate Root → Pitches → Pitch → Camera with correct breadcrumb depth', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Step 1: Start at Root
            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 1);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home']);
                assertionHelpers.assertPathState({});
                assertionHelpers.assertKindState('clubs');
            });

            // Step 2: Click "Pitches" in TreeNav (we'll simulate this by setting path directly)
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({ pitchesRoot: true });
            });

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 2);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Pitches']);
                assertionHelpers.assertPathState({ pitchesRoot: true });
                assertionHelpers.assertKindState('pitches');
            });

            // Step 3: Click "Main Stadium" in EntityList
            const pitchRow = screen.getByText('Main Stadium');
            await user.click(pitchRow);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 3);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Pitches', 'Main Stadium']);
                assertionHelpers.assertPathState({ pitchId: 'pitch-1' });
                assertionHelpers.assertKindState('cameras');
            });

            // Step 4: Click a camera in EntityList (should open details, breadcrumb unchanged)
            const cameraRow = screen.getByText('Main Stadium Camera 1');
            await user.click(cameraRow);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 4); // Should show camera name
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Pitches', 'Main Stadium', 'Main Stadium Camera 1']);
                assertionHelpers.assertPathState({ pitchId: 'pitch-1', cameraId: 'camera-1' }); // Should include cameraId
                assertionHelpers.assertDetailsOpen(true);
            });
        });

        it('should validate depth progression matches File Explorer analogy', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Test club hierarchy depth progression (1→4)
            const depths = [];

            // Root (depth 1)
            depths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);

            // Navigate through club hierarchy
            await clickEntityListItem(user, 'Palermo');
            await waitFor(() => {
                depths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);
            });

            await clickEntityListItem(user, 'Football');
            await waitFor(() => {
                depths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);
            });

            await user.click(screen.getByText("Men's First Team"));
            await waitFor(() => {
                depths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);
            });

            expect(depths).toEqual([1, 2, 3, 4]);

            // Test pitches hierarchy depth progression (1→3)
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({});
            });

            const pitchDepths: number[] = [];

            // Root (depth 1)
            await waitFor(() => {
                pitchDepths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);
            });

            // Navigate to pitches
            act(() => {
                store.setPath({ pitchesRoot: true });
            });
            await waitFor(() => {
                pitchDepths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);
            });

            // Navigate to pitch
            await user.click(screen.getByText('Main Stadium'));
            await waitFor(() => {
                pitchDepths.push(document.querySelectorAll('[aria-label="breadcrumb"] li:not([aria-hidden="true"])').length);
            });

            expect(pitchDepths).toEqual([1, 2, 3]);
        });
    });

    describe('Part 2: Non-Sequential Navigation', () => {
        it('should handle breadcrumb navigation correctly', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Navigate to deep level first
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 4);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football', "Men's First Team"]);
            });

            // Click "Football" in breadcrumb (should go back to depth 3)
            const footballBreadcrumbs = screen.getAllByText('Football');
            const footballBreadcrumb = footballBreadcrumbs.find(el =>
                el.closest('[aria-label="breadcrumb"]') !== null
            );
            await user.click(footballBreadcrumb!);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 3);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football']);
                assertionHelpers.assertPathState({ clubId: 'club-1', sportId: 'sport-1' });
                assertionHelpers.assertKindState('teams');
                assertionHelpers.assertDetailsOpen(false); // Should close details
            });

            // Click "Palermo" in breadcrumb (should go back to depth 2)
            const fcPalermoBreadcrumbs = screen.getAllByText('Palermo');
            const fcPalermoBreadcrumb = fcPalermoBreadcrumbs.find(el =>
                el.closest('[aria-label="breadcrumb"]') !== null
            );
            await user.click(fcPalermoBreadcrumb!);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 2);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo']);
                assertionHelpers.assertPathState({ clubId: 'club-1' });
                assertionHelpers.assertKindState('sports');
            });

            // Click "Home" in breadcrumb (should go back to depth 1)
            const homeBreadcrumb = screen.getByText('Home');
            await user.click(homeBreadcrumb);

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 1);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home']);
                assertionHelpers.assertPathState({});
                assertionHelpers.assertKindState('clubs');
            });
        });

        it('should handle TreeNav cross-branch jumps', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Navigate to Palermo → Football → Men's First Team
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football', "Men's First Team"]);
                assertionHelpers.assertPathState({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });

            // Simulate TreeNav click to different club (Lommel → Football → First Team)
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({ clubId: 'club-2', sportId: 'sport-4', teamId: 'team-9' });
            });

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Lommel', 'Football', 'First Team']);
                assertionHelpers.assertPathState({ clubId: 'club-2', sportId: 'sport-4', teamId: 'team-9' });
                // Verify no Palermo IDs in path
                const updatedStore = useAdminStore.getState();
                expect(updatedStore.path.clubId).toBe('club-2');
                expect(updatedStore.path.sportId).toBe('sport-4');
                expect(updatedStore.path.teamId).toBe('team-9');
            });
        });
    });

    describe('Part 3: Cross-Hierarchy Navigation', () => {
        it('should handle Club ↔ Pitches navigation with path property clearing', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Start in club hierarchy at depth 4
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Palermo', 'Football', "Men's First Team"]);
                assertionHelpers.assertPathState({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });

            // Navigate to Pitches (simulate TreeNav click)
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({ pitchesRoot: true });
            });

            await waitFor(() => {
                const updatedStore = useAdminStore.getState();
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Pitches']);
                assertionHelpers.assertPathState({ pitchesRoot: true });
                assertionHelpers.assertKindState('pitches');
                // Verify no club IDs in path
                console.log('DEBUG: store.path =', JSON.stringify(updatedStore.path));
                console.log('DEBUG: Object.keys(store.path) =', Object.keys(updatedStore.path));
                expect(updatedStore.path.clubId).toBeUndefined();
                expect(updatedStore.path.sportId).toBeUndefined();
                expect(updatedStore.path.teamId).toBeUndefined();
            });

            // Navigate to specific pitch
            await user.click(screen.getByText('Main Stadium'));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Pitches', 'Main Stadium']);
                assertionHelpers.assertPathState({ pitchId: 'pitch-1' });
                assertionHelpers.assertKindState('cameras');
            });

            // Navigate back to club hierarchy
            act(() => {
                store.setPath({ clubId: 'club-2', sportId: 'sport-5', teamId: 'team-12' });
            });

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home', 'Lommel', 'Basketball', 'Senior Basketball']);
                assertionHelpers.assertPathState({ clubId: 'club-2', sportId: 'sport-5', teamId: 'team-12' });
                assertionHelpers.assertKindState('users');
                // Verify no pitch IDs in path
                expect(store.path.pitchId).toBeUndefined();
                expect(store.path.pitchesRoot).toBeUndefined();
            });
        });

        it('should handle depth transitions correctly between hierarchies', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Start at club depth 4
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 4);
            });

            // Jump to pitches depth 2
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({ pitchesRoot: true });
            });

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 2);
            });

            // Jump to pitches depth 3
            await user.click(screen.getByText('Main Stadium'));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 3);
            });

            // Jump back to club depth 2
            act(() => {
                store.setPath({ clubId: 'club-2' });
            });

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 2);
            });
        });
    });

    describe('Part 4: Edge Cases', () => {
        it('should handle maximum depth navigation', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Maximum depth in club hierarchy (4 levels)
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 4);
                assertionHelpers.assertKindState('users');
            });

            // Maximum depth in pitches hierarchy (3 levels)
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({ pitchId: 'pitch-1' });
            });

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 3);
                assertionHelpers.assertKindState('cameras');
            });
        });

        it('should handle rapid navigation', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Rapid navigation sequence
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));

            // Rapid breadcrumb navigation
            await clickEntityListItem(user, 'Football');
            await clickEntityListItem(user, 'Palermo');
            await user.click(screen.getByText('Home'));

            await waitFor(() => {
                assertionHelpers.assertBreadcrumbDepth(document.body, 1);
                assertionHelpers.assertBreadcrumbLabels(document.body, ['Home']);
                assertionHelpers.assertPathState({});
                assertionHelpers.assertKindState('clubs');
            });
        });

        it('should handle navigation with open details', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Navigate to user level and open details
            await clickEntityListItem(user, 'Palermo');
            await clickEntityListItem(user, 'Football');
            await user.click(screen.getByText("Men's First Team"));
            await user.click(screen.getByText('Marco Rossi'));

            await waitFor(() => {
                assertionHelpers.assertDetailsOpen(true);
            });

            // Navigate to parent level (should close details)
            await clickEntityListItem(user, 'Football');

            await waitFor(() => {
                assertionHelpers.assertDetailsOpen(false);
            });

            // Navigate to different team (same depth, should keep details closed)
            const store = useAdminStore.getState();
            act(() => {
                store.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-2' });
            });

            await waitFor(() => {
                assertionHelpers.assertDetailsOpen(false);
            });
        });

        it('should clear selection on navigation', async () => {
            const user = userEvent.setup();

            customRender(<AdminPage />);

            // Navigate to club level and set selection
            await clickEntityListItem(user, 'Palermo');

            // Simulate selection (this would normally be done through checkboxes)
            const store = useAdminStore.getState();
            store.setSelection(['sport-1', 'sport-2']);

            await waitFor(() => {
                assertionHelpers.assertSelection(['sport-1', 'sport-2']);
            });

            // Navigate to different path
            await clickEntityListItem(user, 'Football');

            await waitFor(() => {
                assertionHelpers.assertSelection([]);
            });
        });
    });
});
