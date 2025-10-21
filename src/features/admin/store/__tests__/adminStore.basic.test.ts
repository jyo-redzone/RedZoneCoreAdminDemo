import { useAdminStore } from '../adminStore';

describe('adminStore Basic Test', () => {
    it('should set path correctly', () => {
        const store = useAdminStore.getState();

        // Test basic path setting
        store.setPath({ clubId: 'club-1' });

        const currentState = useAdminStore.getState();
        expect(currentState.path).toEqual({ clubId: 'club-1' });
        expect(currentState.kind).toBe('sports');
    });

    it('should set selection correctly', () => {
        const store = useAdminStore.getState();

        store.setSelection(['item-1', 'item-2']);

        const currentState = useAdminStore.getState();
        expect(currentState.selection).toEqual(['item-1', 'item-2']);
    });

    it('should open details correctly', () => {
        const store = useAdminStore.getState();

        store.openDetails('test-id');

        const currentState = useAdminStore.getState();
        expect(currentState.detailsOpen).toBe(true);
        expect(currentState.currentId).toBe('test-id');
    });
});
