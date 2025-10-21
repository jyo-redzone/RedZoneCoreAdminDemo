import { Close } from '@mui/icons-material';
import { AppBar, Box, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactElement } from 'react';
import { AnyEntity, EntityKind } from '../model/types';
import { CreateEditForm } from './CreateEditForm';

interface DetailsSheetProps {
    open: boolean;
    entity?: AnyEntity;
    kind: EntityKind;
    onClose: () => void;
    onSave: (patch: Partial<AnyEntity>) => void;
    onDelete?: (id: string) => void;
}

const Transition = forwardRef<unknown, TransitionProps & { children: ReactElement }>(
    (props, ref) => <Slide direction="up" ref={ref} {...props} />,
);

export const DetailsSheet = ({
    open,
    entity,
    kind,
    onClose,
    onSave,
    onDelete,
}: DetailsSheetProps) => {
    const isEditing = !!entity;
    const title = isEditing ? `Edit ${kind}` : `Create ${kind}`;

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            sx={{
                '& .MuiDialog-paper': {
                    height: '80vh',
                    maxHeight: '80vh',
                },
            }}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>

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
        </Dialog>
    );
};
