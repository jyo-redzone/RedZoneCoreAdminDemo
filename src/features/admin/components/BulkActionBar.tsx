import { Close, Delete, Edit, PersonAdd } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import { AdminKind } from '../model/types';

interface BulkActionBarProps {
  selectionCount: number;
  onClearSelection: () => void;
  onBulkDelete?: () => void;
  onBulkEdit?: () => void;
  onBulkChangeRole?: () => void;
  kind: AdminKind;
}

export const BulkActionBar = ({
  selectionCount,
  onClearSelection,
  onBulkDelete,
  onBulkEdit,
  onBulkChangeRole,
  kind,
}: BulkActionBarProps) => {
  if (selectionCount === 0) {
    return null;
  }

  const getBulkActions = () => {
    const actions: Array<{
      label: string;
      icon: React.ReactNode;
      onClick?: () => void;
      color: 'error' | 'primary';
    }> = [
        {
          label: 'Delete',
          icon: <Delete />,
          onClick: onBulkDelete,
          color: 'error',
        },
      ];

    if (kind === 'users') {
      actions.unshift({
        label: 'Change Role',
        icon: <PersonAdd />,
        onClick: onBulkChangeRole,
        color: 'primary',
      });
    }

    if (kind === 'teams' || kind === 'pitches' || kind === 'cameras') {
      actions.unshift({
        label: 'Edit',
        icon: <Edit />,
        onClick: onBulkEdit,
        color: 'primary',
      });
    }

    return actions;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          px: 2,
          py: 1,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          minHeight: '56px !important',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Chip
            label={`${selectionCount} selected`}
            color="primary"
            variant="filled"
            size="small"
            sx={{ bgcolor: 'primary.contrastText', color: 'primary.main' }}
          />
          <Typography variant="body2">Bulk actions available</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getBulkActions().map((action, index) => (
            <Button
              key={index}
              startIcon={action.icon}
              onClick={action.onClick}
              color={action.color}
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'primary.contrastText',
                color: 'primary.contrastText',
                '&:hover': {
                  borderColor: 'primary.contrastText',
                  bgcolor: 'primary.contrastText',
                  color: 'primary.main',
                },
              }}
            >
              {action.label}
            </Button>
          ))}
          <IconButton
            onClick={onClearSelection}
            aria-label="clear selection"
            sx={{ color: 'primary.contrastText' }}
          >
            <Close />
          </IconButton>
        </Box>
      </Toolbar>
    </Paper>
  );
};
