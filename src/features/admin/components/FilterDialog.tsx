import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { AdminKind } from '../model/types';

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    kind: AdminKind;
}

interface FilterState {
    role?: string;
    status?: string;
    sportContext?: string;
    clubId?: string;
}

export const FilterDialog = ({ open, onClose, onApply, kind }: FilterDialogProps) => {
    const [filters, setFilters] = useState<FilterState>({});

    const handleFilterChange = (field: keyof FilterState, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value === 'all' ? undefined : value,
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        setFilters({});
        onApply({});
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter((value) => value !== undefined).length;
    };

    const renderUserFilters = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                    value={filters.role || 'all'}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    label="Role"
                >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="tenant_admin">Tenant Admin</MenuItem>
                    <MenuItem value="member">Member</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                    value={filters.status || 'all'}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="invited">Invited</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );

    const renderCameraFilters = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
                <InputLabel>Sport Context</InputLabel>
                <Select
                    value={filters.sportContext || 'all'}
                    onChange={(e) => handleFilterChange('sportContext', e.target.value)}
                    label="Sport Context"
                >
                    <MenuItem value="all">All Sports</MenuItem>
                    <MenuItem value="football">Football</MenuItem>
                    <MenuItem value="rugby">Rugby</MenuItem>
                    <MenuItem value="hockey">Hockey</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Club</InputLabel>
                <Select
                    value={filters.clubId || 'all'}
                    onChange={(e) => handleFilterChange('clubId', e.target.value)}
                    label="Club"
                >
                    <MenuItem value="all">All Clubs</MenuItem>
                    <MenuItem value="club-1">Palermo</MenuItem>
                    <MenuItem value="club-2">Lommel</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );

    const renderFilters = () => {
        switch (kind) {
            case 'users':
                return renderUserFilters();
            case 'cameras':
                return renderCameraFilters();
            default:
                return <Typography color="text.secondary">No filters available for {kind}.</Typography>;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">Filter {kind}</Typography>
                    {getActiveFiltersCount() > 0 && (
                        <Chip label={getActiveFiltersCount()} color="primary" size="small" />
                    )}
                </Box>
            </DialogTitle>

            <DialogContent>{renderFilters()}</DialogContent>

            <DialogActions>
                <Button onClick={handleClear} color="inherit">
                    Clear All
                </Button>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleApply} variant="contained">
                    Apply Filters
                </Button>
            </DialogActions>
        </Dialog>
    );
};
