import { Close } from '@mui/icons-material';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { AnyEntity, EntityKind } from '../model/types';
import { CreateEditForm } from './CreateEditForm';

interface DetailsPanelProps {
    open: boolean;
    entity?: AnyEntity;
    kind: EntityKind;
    onClose: () => void;
    onSave: (patch: Partial<AnyEntity>) => void;
    onDelete?: (id: string) => void;
}

export const DetailsPanel = ({
    open,
    entity,
    kind,
    onClose,
    onSave,
    onDelete,
}: DetailsPanelProps) => {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    const isEditing = !!entity;
    const title = isEditing ? `Edit ${kind}` : `Create ${kind}`;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            variant={isTablet ? 'temporary' : 'persistent'}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 400,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h6">{title}</Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <Close />
                    </IconButton>
                </Box>

                <Divider />

                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    <CreateEditForm
                        kind={kind}
                        value={entity || {}}
                        onChange={(_patch) => {
                            // Handle form changes
                        }}
                        onSubmit={() => {
                            // Handle form submission
                        }}
                        onSave={onSave}
                        onDelete={onDelete}
                        entityId={entity?.id}
                    />
                </Box>
            </Box>
        </Drawer>
    );
};
