import { useAdminStore } from '../adminStore';

describe('adminStore Navigation Logic', () => {
    describe('Path State Updates and Kind Derivation', () => {
        it('should derive correct kind from path depth', () => {
            // Ensure clean state
            useAdminStore.getState().setPath({});
            useAdminStore.getState().setKind('clubs');

            // Root level - clubs
            useAdminStore.getState().setPath({});
            expect(useAdminStore.getState().kind).toBe('clubs');

            // Club level - sports
            useAdminStore.getState().setPath({ clubId: 'club-1' });
            expect(useAdminStore.getState().kind).toBe('sports');

            // Sport level - teams
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            expect(useAdminStore.getState().kind).toBe('teams');

            // Team level - users
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            expect(useAdminStore.getState().kind).toBe('users');

            // User level - users (showing user details)
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            expect(useAdminStore.getState().kind).toBe('users');

            // Pitches root - pitches
            useAdminStore.getState().setPath({ pitchesRoot: true });
            expect(useAdminStore.getState().kind).toBe('pitches');

            // Pitch level - cameras
            useAdminStore.getState().setPath({ pitchId: 'pitch-1' });
            expect(useAdminStore.getState().kind).toBe('cameras');

            // Camera level - cameras (showing camera details)
            useAdminStore.getState().setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            expect(useAdminStore.getState().kind).toBe('cameras');
        });

        it('should completely replace path without lingering IDs', () => {
            // Start with club hierarchy
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            expect(useAdminStore.getState().path).toEqual({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });

            // Switch to pitches hierarchy
            useAdminStore.getState().setPath({ pitchId: 'pitch-1' });
            expect(useAdminStore.getState().path).toEqual({ pitchId: 'pitch-1' });
            expect(useAdminStore.getState().path.clubId).toBeUndefined();
            expect(useAdminStore.getState().path.sportId).toBeUndefined();
            expect(useAdminStore.getState().path.teamId).toBeUndefined();

            // Switch back to club hierarchy
            useAdminStore.getState().setPath({ clubId: 'club-2' });
            expect(useAdminStore.getState().path).toEqual({ clubId: 'club-2' });
            expect(useAdminStore.getState().path.pitchId).toBeUndefined();
            expect(useAdminStore.getState().path.pitchesRoot).toBeUndefined();
        });
    });

    describe('Breadcrumb Depth Validation', () => {
        it('should track correct depth for club hierarchy (1-5)', () => {
            // Depth 1: Root
            useAdminStore.getState().setPath({});
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(0);

            // Depth 2: Club
            useAdminStore.getState().setPath({ clubId: 'club-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(1);

            // Depth 3: Sport
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(2);

            // Depth 4: Team
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(3);

            // Depth 5: User
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(4);
        });

        it('should track correct depth for pitches hierarchy (1-4)', () => {


            // Depth 1: Root
            useAdminStore.getState().setPath({});
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(0);

            // Depth 2: Pitches root
            useAdminStore.getState().setPath({ pitchesRoot: true });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(1);

            // Depth 3: Pitch
            useAdminStore.getState().setPath({ pitchId: 'pitch-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(1);

            // Depth 4: Camera
            useAdminStore.getState().setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(2);
        });

        it('should calculate path depth correctly for navigation detection', () => {


            // Start at depth 3
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            const initialDepth = Object.keys(useAdminStore.getState().path).length;

            // Navigate to depth 2 (parent level)
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            const newDepth = Object.keys(useAdminStore.getState().path).length;

            expect(newDepth).toBeLessThan(initialDepth);
        });
    });

    describe('Details Panel Auto-Close on Parent Navigation', () => {
        it('should close details when navigating to parent level', () => {


            // Start with details open at team level
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            useAdminStore.getState().openDetails('user-1');
            expect(useAdminStore.getState().detailsOpen).toBe(true);

            // Navigate to parent level (sport)
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            expect(useAdminStore.getState().detailsOpen).toBe(false);
            expect(useAdminStore.getState().currentId).toBeUndefined();
        });

        it('should not close details when navigating to same or deeper level', () => {


            // Start with details open at sport level
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            useAdminStore.getState().openDetails('team-1');
            expect(useAdminStore.getState().detailsOpen).toBe(true);

            // Navigate to deeper level (team)
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            expect(useAdminStore.getState().detailsOpen).toBe(true);
            expect(useAdminStore.getState().currentId).toBe('team-1');
        });

        it('should clear focusedId when navigating', () => {


            // Set focused ID
            useAdminStore.getState().setPath({ clubId: 'club-1' });
            useAdminStore.getState().setFocusedId('club-1');
            expect(useAdminStore.getState().focusedId).toBe('club-1');

            // Navigate to different path
            useAdminStore.getState().setPath({ clubId: 'club-2' });
            expect(useAdminStore.getState().focusedId).toBeUndefined();
        });
    });

    describe('Selection Clearing on Path Change', () => {
        it('should clear selection when changing path', () => {


            // Set selection
            useAdminStore.getState().setPath({ clubId: 'club-1' });
            useAdminStore.getState().setSelection(['sport-1', 'sport-2']);
            expect(useAdminStore.getState().selection).toEqual(['sport-1', 'sport-2']);

            // Change path
            useAdminStore.getState().setPath({ clubId: 'club-2' });
            expect(useAdminStore.getState().selection).toEqual([]);
        });

        it('should reset page to 1 when changing path', () => {


            // Set page to 3
            useAdminStore.getState().setPaging(3);
            expect(useAdminStore.getState().page).toBe(3);

            // Change path
            useAdminStore.getState().setPath({ clubId: 'club-1' });
            expect(useAdminStore.getState().page).toBe(1);
        });
    });

    describe('Cross-Hierarchy Navigation', () => {
        it('should clear club hierarchy when navigating to pitches', () => {


            // Start in club hierarchy
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            expect(useAdminStore.getState().path.clubId).toBe('club-1');
            expect(useAdminStore.getState().path.sportId).toBe('sport-1');
            expect(useAdminStore.getState().path.teamId).toBe('team-1');

            // Navigate to pitches
            useAdminStore.getState().setPath({ pitchesRoot: true });
            expect(useAdminStore.getState().path.clubId).toBeUndefined();
            expect(useAdminStore.getState().path.sportId).toBeUndefined();
            expect(useAdminStore.getState().path.teamId).toBeUndefined();
            expect(useAdminStore.getState().path.pitchesRoot).toBe(true);
        });

        it('should clear pitches hierarchy when navigating to clubs', () => {


            // Start in pitches hierarchy
            useAdminStore.getState().setPath({ pitchId: 'pitch-1' });
            expect(useAdminStore.getState().path.pitchId).toBe('pitch-1');

            // Navigate to clubs
            useAdminStore.getState().setPath({ clubId: 'club-2' });
            expect(useAdminStore.getState().path.pitchId).toBeUndefined();
            expect(useAdminStore.getState().path.pitchesRoot).toBeUndefined();
            expect(useAdminStore.getState().path.clubId).toBe('club-2');
        });

        it('should clear userId when navigating to different path', () => {


            // Start with user selected
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            expect(useAdminStore.getState().path.userId).toBe('user-1');

            // Navigate to different team
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-2' });
            expect(useAdminStore.getState().path.userId).toBeUndefined();
            expect(useAdminStore.getState().path.teamId).toBe('team-2');
        });

        it('should clear cameraId when navigating to different path', () => {


            // Start with camera selected
            useAdminStore.getState().setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            expect(useAdminStore.getState().path.cameraId).toBe('camera-1');

            // Navigate to different pitch
            useAdminStore.getState().setPath({ pitchId: 'pitch-2' });
            expect(useAdminStore.getState().path.cameraId).toBeUndefined();
            expect(useAdminStore.getState().path.pitchId).toBe('pitch-2');
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid successive navigation', () => {


            // Rapid navigation
            useAdminStore.getState().setPath({ clubId: 'club-1' });
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            useAdminStore.getState().setPath({ clubId: 'club-2' });

            expect(useAdminStore.getState().path).toEqual({ clubId: 'club-2' });
            expect(useAdminStore.getState().kind).toBe('sports');
        });

        it('should handle navigation with open details', () => {


            // Open details
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1' });
            useAdminStore.getState().openDetails('user-1');
            expect(useAdminStore.getState().detailsOpen).toBe(true);

            // Navigate to different team (same depth)
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-2' });
            expect(useAdminStore.getState().detailsOpen).toBe(true); // Should remain open at same depth

            // Navigate to parent level
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1' });
            expect(useAdminStore.getState().detailsOpen).toBe(false); // Should close when going up
        });

        it('should handle maximum depth navigation', () => {


            // Maximum depth in club hierarchy (5 levels)
            useAdminStore.getState().setPath({ clubId: 'club-1', sportId: 'sport-1', teamId: 'team-1', userId: 'user-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(4);
            expect(useAdminStore.getState().kind).toBe('users');

            // Maximum depth in pitches hierarchy (4 levels)
            useAdminStore.getState().setPath({ pitchId: 'pitch-1', cameraId: 'camera-1' });
            expect(Object.keys(useAdminStore.getState().path)).toHaveLength(2);
            expect(useAdminStore.getState().kind).toBe('cameras');
        });
    });
});
