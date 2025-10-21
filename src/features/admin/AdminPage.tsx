import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { HeaderBar } from '../../layout/HeaderBar';
import { ResponsiveLayout } from '../../layout/ResponsiveLayout';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { SnackbarProvider, useSnackbarContext } from '../../shared/components/SnackbarProvider';
import { BulkActionBar } from './components/BulkActionBar';
import { DetailsPanel } from './components/DetailsPanel';
import { DetailsSheet } from './components/DetailsSheet';
import { EntityList } from './components/EntityList';
import { FilterDialog } from './components/FilterDialog';
import { ListToolbar } from './components/ListToolbar';
import { TreeNav } from './components/TreeNav';
import { useAdminController } from './hooks/useAdminController';
import { Path } from './model/types';

const AdminPageContent = () => {
    const controller = useAdminController();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const showMenuButton = useMediaQuery(theme.breakpoints.down('lg'));
    const snackbar = useSnackbarContext();

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const [filterDialog, setFilterDialog] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentEntity, setCurrentEntity] = useState<any>(null);

    const handleAdd = () => {
        setCurrentEntity({});
        controller.openDetails('new');
    };

    const handleBulkDelete = () => {
        setConfirmDialog({
            open: true,
            title: 'Delete Items',
            message: `Are you sure you want to delete ${controller.selectionCount} selected items?`,
            onConfirm: () => {
                controller.removeEntities(controller.selection);
                setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
        });
    };

    const handleBulkChangeRole = () => {
        setConfirmDialog({
            open: true,
            title: 'Change Role',
            message: `Change role to tenant_admin for ${controller.selectionCount} selected users?`,
            onConfirm: () => {
                controller.bulkChangeRole(controller.selection, 'tenant_admin');
                snackbar.showSuccess(`${controller.selectionCount} users updated to tenant_admin`);
                setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
        });
    };

    const handleBulkEdit = () => {
        snackbar.showInfo('Bulk edit feature coming soon');
    };

    const handleClearSelection = () => {
        controller.setSelection([]);
    };

    const handleFilter = () => {
        setFilterDialog(true);
    };

    const handleRowClick = (id: string) => {
        const { kind, path } = controller;

        // Container items: Navigate down the hierarchy
        if (kind === 'home') {
            // Check if it's a club or pitches category
            if (id === 'pitches-root') {
                // Navigate to pitches root
                controller.closeDetails();
                controller.setPath({ pitchesRoot: true });
                controller.setFocusedId(id);
            } else {
                // It's a club
                controller.closeDetails();
                controller.setPath({ clubId: id });
                controller.setFocusedId(id);
            }
        } else if (kind === 'clubs') {
            controller.closeDetails();
            controller.setPath({ clubId: id });
            controller.setFocusedId(id);
        } else if (kind === 'sports') {
            controller.closeDetails();
            controller.setPath({ clubId: path.clubId, sportId: id });
            controller.setFocusedId(id);
        } else if (kind === 'teams') {
            controller.closeDetails();
            controller.setPath({ clubId: path.clubId, sportId: path.sportId, teamId: id });
            controller.setFocusedId(id);
        } else if (kind === 'pitches') {
            controller.closeDetails();
            controller.setPath({ pitchId: id });
            controller.setFocusedId(id);
        } else if (kind === 'users') {
            // Navigate to specific user
            controller.closeDetails();
            controller.setPath({ clubId: path.clubId, sportId: path.sportId, teamId: path.teamId, userId: id });
            controller.setFocusedId(id);
            controller.openDetails(id);
        } else if (kind === 'cameras') {
            // Navigate to specific camera
            controller.closeDetails();
            controller.setPath({ pitchId: path.pitchId, cameraId: id });
            controller.setFocusedId(id);
            controller.openDetails(id);
        } else {
            // Fallback for any other leaf items
            controller.setFocusedId(id);
            if (id === 'new') {
                setCurrentEntity({});
            } else {
                // In a real app, we'd fetch the entity by ID
                setCurrentEntity({ id, name: 'Sample Entity' });
            }
            controller.openDetails(id);
        }
    };

    const handleSave = async (patch: Record<string, unknown>) => {
        try {
            if (controller.currentId === 'new') {
                await controller.createEntity(
                    controller.kind === 'home'
                        ? 'club' // Default to club for home view
                        : controller.kind === 'users'
                            ? 'user'
                            : controller.kind === 'teams'
                                ? 'team'
                                : controller.kind === 'pitches'
                                    ? 'pitch'
                                    : controller.kind === 'cameras'
                                        ? 'camera'
                                        : controller.kind === 'sports'
                                            ? 'sport'
                                            : 'club',
                    patch,
                );
                snackbar.showSuccess(`${controller.kind.slice(0, -1)} created successfully`);
            } else {
                await controller.saveEntity(patch);
                snackbar.showSuccess(`${controller.kind.slice(0, -1)} updated successfully`);
            }
            controller.closeDetails();
        } catch {
            snackbar.showError('Failed to save changes');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await controller.removeEntities([id]);
            snackbar.showSuccess('Item deleted successfully');
            controller.closeDetails();
        } catch {
            snackbar.showError('Failed to delete item');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleApplyFilters = (filters: any) => {
        // In a real app, we'd apply these filters to the store
        snackbar.showInfo('Filters applied');
    };

    const handleTreeSelect = (path: Partial<Path>) => {
        controller.setPath(path);
        if (showMenuButton) {
            controller.closeDrawer();
        }
    };

    return (
        <ResponsiveLayout
            drawerOpen={controller.drawerOpen}
            onDrawerClose={controller.closeDrawer}
            treeNav={<TreeNav path={controller.path} onSelectNode={handleTreeSelect} />}
        >
            <HeaderBar
                breadcrumbs={controller.breadcrumbs}
                onMenuClick={controller.toggleDrawer}
                showMenuButton={showMenuButton}
            />
            {!showMenuButton && <TreeNav path={controller.path} onSelectNode={controller.setPath} />}
            <Box sx={{ gridArea: 'list', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <EntityList
                    kind={controller.kind}
                    items={controller.items}
                    selection={controller.selection}
                    focusedId={controller.focusedId}
                    onRowClick={handleRowClick}
                    onSelectionChange={controller.setSelection}
                    toolbar={
                        <ListToolbar
                            kind={controller.kind}
                            query={controller.query}
                            onQueryChange={controller.setQuery}
                            selectionCount={controller.selectionCount}
                            total={controller.total}
                            onAdd={handleAdd}
                            onFilter={handleFilter}
                        />
                    }
                    bulkBar={(controller.kind === 'users' || controller.kind === 'home') && (
                        <BulkActionBar
                            selectionCount={controller.selectionCount}
                            onClearSelection={handleClearSelection}
                            onBulkDelete={handleBulkDelete}
                            onBulkEdit={handleBulkEdit}
                            onBulkChangeRole={handleBulkChangeRole}
                            kind={controller.kind}
                        />
                    )}
                    loading={controller.loading}
                    total={controller.total}
                    page={controller.page}
                    pageSize={controller.pageSize}
                    onPageChange={controller.setPaging}
                />
            </Box>
            {/* {!isMobile && (controller.kind === 'users' || controller.kind === 'cameras' || controller.kind === 'home') && (
                <DetailsPanel
                    open={controller.detailsOpen}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    entity={currentEntity as any}
                    kind={
                        controller.kind === 'home'
                            ? 'club' // Default to club for home view
                            : controller.kind === 'users'
                                ? 'user'
                                : 'camera'
                    }
                    onClose={controller.closeDetails}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )} */}

            {/* {isMobile && (controller.kind === 'users' || controller.kind === 'cameras' || controller.kind === 'home') && (
                <DetailsSheet
                    open={controller.detailsOpen}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    entity={currentEntity as any}
                    kind={
                        controller.kind === 'home'
                            ? 'club' // Default to club for home view
                            : controller.kind === 'users'
                                ? 'user'
                                : 'camera'
                    }
                    onClose={controller.closeDetails}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )} */}
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
            />

            <FilterDialog
                open={filterDialog}
                onClose={() => setFilterDialog(false)}
                onApply={handleApplyFilters}
                kind={controller.kind}
            />
        </ResponsiveLayout>
    );
};

export const AdminPage = () => {
    return (
        <SnackbarProvider>
            <AdminPageContent />
        </SnackbarProvider>
    );
};
