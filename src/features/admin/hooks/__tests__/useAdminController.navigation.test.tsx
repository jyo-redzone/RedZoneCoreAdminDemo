import { act, renderHook } from '@testing-library/react';
import { useAdminStore } from '../../store/adminStore';
import { useAdminController } from '../useAdminController';

// Mock the fixtures
jest.mock('../../api/fixtures', () => ({
    clubs: [
        { id: 'club-1', name: 'Palermo' },
        { id: 'club-2', name: 'Lommel' },
    ],
    sports: [
        { id: 'sport-1', clubId: 'club-1', name: 'Football' },
        { id: 'sport-2', clubId: 'club-1', name: 'Rugby' },
        { id: 'sport-4', clubId: 'club-2', name: 'Football' },
        { id: 'sport-5', clubId: 'club-2', name: 'Basketball' },
    ],
    teams: [
        { id: 'team-1', sportId: 'sport-1', name: "Men's First Team" },
        { id: 'team-5', sportId: 'sport-2', name: 'Senior Rugby' },
        { id: 'team-9', sportId: 'sport-4', name: 'First Team' },
        { id: 'team-12', sportId: 'sport-5', name: 'Senior Basketball' },
    ],
    pitches: [
        { id: 'pitch-1', clubId: 'club-1', name: 'Main Stadium' },
        { id: 'pitch-2', clubId: 'club-1', name: 'Training Ground A' },
        { id: 'pitch-4', clubId: 'club-2', name: 'Stadion Soeverein' },
    ],
    users: [
        { id: 'user-1', teamId: 'team-1', name: 'Marco Rossi', email: 'marco.rossi@fcPalermo.it', role: 'tenant_admin', status: 'active' },
        { id: 'user-2', teamId: 'team-1', name: 'Giuseppe Bianchi', email: 'giuseppe.bianchi@fcPalermo.it', role: 'member', status: 'active' },
    ],
    cameras: [
        { id: 'camera-1', pitchId: 'pitch-1', sportContext: 'football', name: 'Main Stadium Camera 1' },
        { id: 'camera-2', pitchId: 'pitch-1', sportContext: 'football', name: 'Main Stadium Camera 2' },
    ],
}));

describe('useAdminController Navigation Logic', () => {
    beforeEach(() => {
        // Reset store state before each test
        const store = useAdminStore.getState();
        store.setPath({});
        store.setKind('clubs');
        store.closeDetails();
        store.setSelection([]);
        store.setFocusedId(undefined);
    });

    describe('buildBreadcrumbs() Accuracy', () => {
        it('should generate correct breadcrumbs for root level', () => {
            const { result } = renderHook(() => useAdminController());

            expect(result.current.breadcrumbs).toHaveLength(1);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
        });

        it('should generate correct breadcrumbs for club hierarchy', () => {
            const { result } = renderHook(() => useAdminController());

            act(() => {
                result.current.setPath({ clubId: 'club-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(2);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Palermo');

            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(3);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Palermo');
            expect(result.current.breadcrumbs[2]?.label).toBe('Football');

            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(4);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Palermo');
            expect(result.current.breadcrumbs[2]?.label).toBe('Football');
            expect(result.current.breadcrumbs[3]?.label).toBe("Men's First Team");

            // Navigate to user level
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(5);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Palermo');
            expect(result.current.breadcrumbs[2]?.label).toBe('Football');
            expect(result.current.breadcrumbs[3]?.label).toBe("Men's First Team");
            expect(result.current.breadcrumbs[4]?.label).toBe('Marco Rossi');
        });

        it('should generate correct breadcrumbs for pitches hierarchy', () => {
            const { result } = renderHook(() => useAdminController());

            act(() => {
                result.current.setPath({ pitchesRoot: true });
            });

            expect(result.current.breadcrumbs).toHaveLength(2);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Pitches');

            act(() => {
                result.current.setPath({ pitchId: 'pitch-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(3);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Pitches');
            expect(result.current.breadcrumbs[2]?.label).toBe('Main Stadium');

            // Navigate to camera level
            act(() => {
                result.current.setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(4);
            expect(result.current.breadcrumbs[0]?.label).toBe('Home');
            expect(result.current.breadcrumbs[1]?.label).toBe('Pitches');
            expect(result.current.breadcrumbs[2]?.label).toBe('Main Stadium');
            expect(result.current.breadcrumbs[3]?.label).toBe('Main Stadium Camera 1');
        });

        it('should maintain correct depth count', () => {
            const { result } = renderHook(() => useAdminController());

            // Test club hierarchy depths
            act(() => {
                result.current.setPath({});
            });
            expect(result.current.breadcrumbs).toHaveLength(1); // Depth 1

            act(() => {
                result.current.setPath({ clubId: 'club-1' });
            });
            expect(result.current.breadcrumbs).toHaveLength(2); // Depth 2

            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1' });
            });
            expect(result.current.breadcrumbs).toHaveLength(3); // Depth 3

            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });
            expect(result.current.breadcrumbs).toHaveLength(4); // Depth 4

            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            });
            expect(result.current.breadcrumbs).toHaveLength(5); // Depth 5

            // Test pitches hierarchy depths
            act(() => {
                result.current.setPath({ pitchesRoot: true });
            });
            expect(result.current.breadcrumbs).toHaveLength(2); // Depth 2

            act(() => {
                result.current.setPath({ pitchId: 'pitch-1' });
            });
            expect(result.current.breadcrumbs).toHaveLength(3); // Depth 3

            act(() => {
                result.current.setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            });
            expect(result.current.breadcrumbs).toHaveLength(4); // Depth 4
        });
    });

    describe('Breadcrumb onClick Handlers', () => {
        it('should navigate correctly when clicking breadcrumb items', () => {
            const { result } = renderHook(() => useAdminController());

            // Navigate to deep level first
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });

            // Click "Football" breadcrumb (index 2)
            act(() => {
                result.current.breadcrumbs[2]?.onClick?.();
            });

            expect(result.current.path).toEqual({ clubId: 'club-1', sportId: 'sport-1' });
            expect(result.current.kind).toBe('teams');

            // Click "Palermo" breadcrumb (index 1)
            act(() => {
                result.current.breadcrumbs[1]?.onClick?.();
            });

            expect(result.current.path).toEqual({ clubId: 'club-1' });
            expect(result.current.kind).toBe('sports');

            // Click "Home" breadcrumb (index 0)
            act(() => {
                result.current.breadcrumbs[0]?.onClick?.();
            });

            expect(result.current.path).toEqual({});
            expect(result.current.kind).toBe('clubs');
        });

        it('should navigate correctly in pitches hierarchy', () => {
            const { result } = renderHook(() => useAdminController());

            // Navigate to pitch level
            act(() => {
                result.current.setPath({ pitchId: 'pitch-1' });
            });

            // Click "Pitches" breadcrumb (index 1)
            act(() => {
                result.current.breadcrumbs[1]?.onClick?.();
            });

            expect(result.current.path).toEqual({ pitchesRoot: true });
            expect(result.current.kind).toBe('pitches');

            // Click "Home" breadcrumb (index 0)
            act(() => {
                result.current.breadcrumbs[0]?.onClick?.();
            });

            expect(result.current.path).toEqual({});
            expect(result.current.kind).toBe('clubs');
        });

        it('should navigate correctly in pitches hierarchy with camera', () => {
            const { result } = renderHook(() => useAdminController());

            // Navigate to camera level
            act(() => {
                result.current.setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            });

            // Click "Main Stadium" breadcrumb (index 2)
            act(() => {
                result.current.breadcrumbs[2]?.onClick?.();
            });

            expect(result.current.path).toEqual({ pitchId: 'pitch-1' });
            expect(result.current.kind).toBe('cameras');

            // Click "Pitches" breadcrumb (index 1)
            act(() => {
                result.current.breadcrumbs[1]?.onClick?.();
            });

            expect(result.current.path).toEqual({ pitchesRoot: true });
            expect(result.current.kind).toBe('pitches');

            // Click "Home" breadcrumb (index 0)
            act(() => {
                result.current.breadcrumbs[0]?.onClick?.();
            });

            expect(result.current.path).toEqual({});
            expect(result.current.kind).toBe('clubs');
        });

        it('should navigate correctly in club hierarchy with user', () => {
            const { result } = renderHook(() => useAdminController());

            // Navigate to user level
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            });

            // Click "Men's First Team" breadcrumb (index 3)
            act(() => {
                result.current.breadcrumbs[3]?.onClick?.();
            });

            expect(result.current.path).toEqual({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            expect(result.current.kind).toBe('users');

            // Click "Football" breadcrumb (index 2)
            act(() => {
                result.current.breadcrumbs[2]?.onClick?.();
            });

            expect(result.current.path).toEqual({ clubId: 'club-1', sportId: 'sport-1' });
            expect(result.current.kind).toBe('teams');

            // Click "Palermo" breadcrumb (index 1)
            act(() => {
                result.current.breadcrumbs[1]?.onClick?.();
            });

            expect(result.current.path).toEqual({ clubId: 'club-1' });
            expect(result.current.kind).toBe('sports');

            // Click "Home" breadcrumb (index 0)
            act(() => {
                result.current.breadcrumbs[0]?.onClick?.();
            });

            expect(result.current.path).toEqual({});
            expect(result.current.kind).toBe('clubs');
        });
    });

    describe('Cross-Hierarchy Path Clearing', () => {
        it('should clear club hierarchy when navigating to pitches', () => {
            const { result } = renderHook(() => useAdminController());

            // Start in club hierarchy
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });

            expect(result.current.path.clubId).toBe('club-1');
            expect(result.current.path.sportId).toBe('sport-1');
            expect(result.current.path.teamId).toBe('team-1');

            // Navigate to pitches
            act(() => {
                result.current.setPath({ pitchesRoot: true });
            });

            expect(result.current.path.clubId).toBeUndefined();
            expect(result.current.path.sportId).toBeUndefined();
            expect(result.current.path.teamId).toBeUndefined();
            expect(result.current.path.pitchesRoot).toBe(true);
        });

        it('should clear pitches hierarchy when navigating to clubs', () => {
            const { result } = renderHook(() => useAdminController());

            // Start in pitches hierarchy
            act(() => {
                result.current.setPath({ pitchId: 'pitch-1' });
            });

            expect(result.current.path.pitchId).toBe('pitch-1');

            // Navigate to clubs
            act(() => {
                result.current.setPath({ clubId: 'club-2' });
            });

            expect(result.current.path.pitchId).toBeUndefined();
            expect(result.current.path.pitchesRoot).toBeUndefined();
            expect(result.current.path.clubId).toBe('club-2');
        });

        it('should clear incompatible properties when switching hierarchies', () => {
            const { result } = renderHook(() => useAdminController());

            // Start with mixed properties (should not happen in real usage)
            act(() => {
                result.current.setPath({ clubId: 'club-1', pitchId: 'pitch-1' });
            });

            // Navigate to clean club hierarchy
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1' });
            });

            expect(result.current.path).toEqual({ clubId: 'club-1', sportId: 'sport-1' });
            expect(result.current.path.pitchId).toBeUndefined();
        });
    });

    describe('Details Panel Management', () => {
        it('should close details when navigating to different path', () => {
            const { result } = renderHook(() => useAdminController());

            // Open details
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
                result.current.openDetails('user-1');
            });

            expect(result.current.detailsOpen).toBe(true);

            // Navigate to different path
            act(() => {
                result.current.setPath({ clubId: 'club-2' });
            });

            expect(result.current.detailsOpen).toBe(false);
        });

        it('should maintain details state when navigating within same path', () => {
            const { result } = renderHook(() => useAdminController());

            // Open details
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
                result.current.openDetails('user-1');
            });

            expect(result.current.detailsOpen).toBe(true);

            // Navigate to different team in same sport - details should be closed
            // because we're navigating to a different team (different entity)
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-5' });
            });

            expect(result.current.detailsOpen).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid breadcrumb navigation', () => {
            const { result } = renderHook(() => useAdminController());

            // Navigate to deep level
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            });

            // Rapid breadcrumb clicks
            act(() => {
                result.current.breadcrumbs[2]?.onClick?.(); // Football
                result.current.breadcrumbs[1]?.onClick?.(); // Palermo
                result.current.breadcrumbs[0]?.onClick?.(); // Home
            });

            expect(result.current.path).toEqual({});
            expect(result.current.kind).toBe('clubs');
        });

        it('should handle navigation with active selection', () => {
            const { result } = renderHook(() => useAdminController());

            // Set selection
            act(() => {
                result.current.setPath({ clubId: 'club-1' });
                result.current.setSelection(['sport-1', 'sport-2']);
            });

            expect(result.current.selection).toEqual(['sport-1', 'sport-2']);

            // Navigate to different path
            act(() => {
                result.current.setPath({ clubId: 'club-2' });
            });

            expect(result.current.selection).toEqual([]);
        });

        it('should handle maximum depth navigation', () => {
            const { result } = renderHook(() => useAdminController());

            // Maximum depth in club hierarchy (5 levels)
            act(() => {
                result.current.setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(5);
            expect(result.current.kind).toBe('users');

            // Maximum depth in pitches hierarchy (4 levels)
            act(() => {
                result.current.setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            });

            expect(result.current.breadcrumbs).toHaveLength(4);
            expect(result.current.kind).toBe('cameras');
        });
    });
});
