import { Add, SearchOff } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { AdminKind } from '../model/types';

interface EmptyStateProps {
  kind: AdminKind;
  onAdd?: () => void;
  hasSearch?: boolean;
}

export const EmptyState = ({ kind, onAdd, hasSearch = false }: EmptyStateProps) => {
  const getEmptyMessage = () => {
    if (hasSearch) {
      return {
        title: 'No results found',
        description: 'Try adjusting your search terms or filters.',
        action: 'Clear search',
      };
    }

    switch (kind) {
      case 'clubs':
        return {
          title: 'No clubs yet',
          description: 'Start by adding clubs to the system.',
          action: 'Add Club',
        };
      case 'sports':
        return {
          title: 'No sports yet',
          description: 'Add sports for this club.',
          action: 'Add Sport',
        };
      case 'users':
        return {
          title: 'No users yet',
          description: 'Start by adding users to this team.',
          action: 'Add User',
        };
      case 'teams':
        return {
          title: 'No teams yet',
          description: 'Create teams for this sport.',
          action: 'Add Team',
        };
      case 'pitches':
        return {
          title: 'No pitches yet',
          description: 'Add pitches for this club.',
          action: 'Add Pitch',
        };
      case 'cameras':
        return {
          title: 'No cameras yet',
          description: 'Set up cameras for this pitch.',
          action: 'Add Camera',
        };
      default:
        return {
          title: 'No items found',
          description: 'Get started by adding your first item.',
          action: 'Add Item',
        };
    }
  };

  const { title, description, action } = getEmptyMessage();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          mb: 2,
        }}
      >
        {hasSearch ? (
          <SearchOff sx={{ fontSize: 40, color: 'grey.400' }} />
        ) : (
          <Add sx={{ fontSize: 40, color: 'grey.400' }} />
        )}
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
        {description}
      </Typography>
      {onAdd && (
        <Button variant="contained" startIcon={<Add />} onClick={onAdd} sx={{ minWidth: 140 }}>
          {action}
        </Button>
      )}
    </Box>
  );
};
