import { useCallback, useEffect } from 'react';
import { cameras, clubs, pitches, sports, teams, users } from '../api/fixtures';
import { AdminKind, Path } from '../model/types';
import { useAdminStore } from '../store/adminStore';

// Helper functions to get entity names
const getClubName = (clubId: string) => {
  const club = clubs.find(c => c.id === clubId);
  return club?.name || clubId;
};

const getSportName = (sportId: string) => {
  const sport = sports.find(s => s.id === sportId);
  return sport?.name || sportId;
};

const getTeamName = (teamId: string) => {
  const team = teams.find(t => t.id === teamId);
  return team?.name || teamId;
};

const getPitchName = (pitchId: string) => {
  const pitch = pitches.find(p => p.id === pitchId);
  return pitch?.name || pitchId;
};

const getUserName = (userId: string) => {
  const user = users.find(u => u.id === userId);
  return user?.name || userId;
};

const getCameraName = (cameraId: string) => {
  const camera = cameras.find(c => c.id === cameraId);
  return camera?.name || `Camera ${cameraId}`;
};

export const useAdminController = () => {
  const store = useAdminStore();

  // Load data when path or kind changes
  useEffect(() => {
    store.load();
  }, [store.path, store.kind, store.query, store.page, store.pageSize]);

  const setPath = useCallback(
    (path: Partial<Path>) => {
      // setPath already handles closing details when navigating to parent levels
      store.setPath(path);
    },
    [store.setPath],
  );

  const setKind = useCallback(
    (kind: AdminKind) => {
      store.setKind(kind);
    },
    [store.setKind],
  );

  const setSelection = useCallback(
    (ids: string[]) => {
      store.setSelection(ids);
    },
    [store.setSelection],
  );

  const setFocusedId = useCallback(
    (id?: string) => {
      store.setFocusedId(id);
    },
    [store.setFocusedId],
  );

  const setQuery = useCallback(
    (query: string) => {
      store.setQuery(query);
    },
    [store.setQuery],
  );

  const setPaging = useCallback(
    (page: number, pageSize?: number) => {
      store.setPaging(page, pageSize);
    },
    [store.setPaging],
  );

  const openDetails = useCallback(
    (id: string) => {
      store.openDetails(id);
    },
    [store.openDetails],
  );

  const closeDetails = useCallback(() => {
    store.closeDetails();
  }, [store.closeDetails]);

  const toggleDrawer = useCallback(() => {
    store.toggleDrawer();
  }, [store.toggleDrawer]);

  const closeDrawer = useCallback(() => {
    store.closeDrawer();
  }, [store.closeDrawer]);

  const saveEntity = useCallback(
    (patch: Record<string, unknown>) => {
      store.save(patch);
    },
    [store.save],
  );

  const createEntity = useCallback(
    (kind: string, payload: Record<string, unknown>) => {
      store.create(kind as 'club' | 'sport' | 'team' | 'user' | 'pitch' | 'camera', payload);
    },
    [store.create],
  );

  const removeEntities = useCallback(
    (ids: string[]) => {
      store.remove(ids);
    },
    [store.remove],
  );

  const bulkChangeRole = useCallback(
    (ids: string[], role: 'tenant_admin' | 'member') => {
      store.bulkChangeRole(ids, role);
    },
    [store.bulkChangeRole],
  );

  // Build breadcrumbs from current path
  const buildBreadcrumbs = useCallback(() => {
    const breadcrumbs = [];
    const { path } = store;

    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      onClick: () => setPath({}),
    });

    // If at root level, we're done
    if (!path.clubId && !path.pitchId && !path.pitchesRoot) {
      return breadcrumbs;
    }

    // Determine which hierarchy we're in based on the path
    const isInPitchesHierarchy = path.pitchesRoot || path.pitchId;
    const isInClubHierarchy = path.clubId || path.sportId || path.teamId;

    // Pitches hierarchy
    if (isInPitchesHierarchy) {
      breadcrumbs.push({
        label: 'Pitches',
        onClick: () => setPath({ pitchesRoot: true }),
      });

      // If at specific pitch level
      if (path.pitchId) {
        const pitchName = getPitchName(path.pitchId);
        breadcrumbs.push({
          label: pitchName,
          onClick: () => setPath({ pitchId: path.pitchId }),
        });

        // If at specific camera level
        if (path.cameraId) {
          const cameraName = getCameraName(path.cameraId);
          breadcrumbs.push({
            label: cameraName,
            onClick: () => setPath({ pitchId: path.pitchId, cameraId: path.cameraId }),
          });
        }
      }
    }
    // Club hierarchy: Club -> Sport -> Team
    else if (isInClubHierarchy) {
      if (path.clubId) {
        const clubName = getClubName(path.clubId);
        breadcrumbs.push({
          label: clubName,
          onClick: () => setPath({ clubId: path.clubId }),
        });
      }

      if (path.sportId) {
        const sportName = getSportName(path.sportId);
        breadcrumbs.push({
          label: sportName,
          onClick: () => setPath({ clubId: path.clubId, sportId: path.sportId }),
        });
      }

      if (path.teamId) {
        const teamName = getTeamName(path.teamId);
        breadcrumbs.push({
          label: teamName,
          onClick: () => setPath({ clubId: path.clubId, sportId: path.sportId, teamId: path.teamId }),
        });

        // If at specific user level
        if (path.userId) {
          const userName = getUserName(path.userId);
          breadcrumbs.push({
            label: userName,
            onClick: () => setPath({ clubId: path.clubId, sportId: path.sportId, teamId: path.teamId, userId: path.userId }),
          });
        }
      }
    }

    return breadcrumbs;
  }, [store.path, setPath]);

  return {
    // State
    path: store.path,
    kind: store.kind,
    items: store.items,
    total: store.total,
    selection: store.selection,
    query: store.query,
    page: store.page,
    pageSize: store.pageSize,
    detailsOpen: store.detailsOpen,
    currentId: store.currentId,
    focusedId: store.focusedId,
    drawerOpen: store.drawerOpen,
    loading: store.loading,
    error: store.error,

    // Actions
    setPath,
    setKind,
    setSelection,
    setFocusedId,
    setQuery,
    setPaging,
    openDetails,
    closeDetails,
    toggleDrawer,
    closeDrawer,
    saveEntity,
    createEntity,
    removeEntities,
    bulkChangeRole,

    // Computed
    breadcrumbs: buildBreadcrumbs(),
    hasSelection: store.selection.length > 0,
    selectionCount: store.selection.length,
  };
};
