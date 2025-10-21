import { Add, FilterList, Search } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

interface ListToolbarProps {
  kind: string;
  query: string;
  onQueryChange: (query: string) => void;
  selectionCount?: number;
  total?: number;
  onAdd?: () => void;
  onFilter?: () => void;
}

export const ListToolbar = ({
  kind,
  query,
  onQueryChange,
  selectionCount = 0,
  total = 0,
  onAdd,
  onFilter,
}: ListToolbarProps) => {
  const [localQuery, setLocalQuery] = useState(query);
  const debouncedQuery = useDebouncedValue(localQuery, 300);

  // Update parent when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery !== query) {
      onQueryChange(debouncedQuery);
    }
  }, [debouncedQuery, query, onQueryChange]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(event.target.value);
  };

  return (
    <Toolbar
      sx={{
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        minHeight: '64px !important',
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <h3>{kind.toUpperCase()}</h3>
        <TextField
          size="small"
          placeholder="Search..."
          value={localQuery}
          onChange={handleQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        <IconButton onClick={onFilter} aria-label="filter">
          <FilterList />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {selectionCount > 0 && (
          <Chip
            label={`${selectionCount} selected`}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
        <Typography variant="body2" color="text.secondary">
          {total} total
        </Typography>
        <IconButton
          color="primary"
          onClick={onAdd}
          aria-label="add new item"
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Add />
        </IconButton>
      </Box>
    </Toolbar>
  );
};
