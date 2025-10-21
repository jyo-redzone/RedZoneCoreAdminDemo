import { CameraAlt, Delete, Edit, Group, LocationOn, MoreVert, Person, Sports, SportsSoccer } from '@mui/icons-material';
import {
    Box,
    Checkbox,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { AdminKind, ListItemVM } from '../model/types';
import { Pagination } from './Pagination';

interface EntityListProps {
    kind: AdminKind;
    items: ListItemVM[];
    selection: string[];
    focusedId?: string;
    onRowClick: (id: string) => void;
    onSelectionChange: (ids: string[]) => void;
    toolbar?: React.ReactNode;
    bulkBar?: React.ReactNode;
    loading?: boolean;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
}

export const EntityList = ({
    kind,
    items,
    selection,
    focusedId,
    onRowClick,
    onSelectionChange,
    toolbar,
    bulkBar,
    loading = false,
    total,
    page,
    pageSize,
    onPageChange,
}: EntityListProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectionChange(items.map((item) => item.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selection, id]);
        } else {
            onSelectionChange(selection.filter((itemId) => itemId !== id));
        }
    };

    const handleRowClick = (id: string) => {
        onRowClick(id);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    const handleEdit = () => {
        if (selectedId) {
            onRowClick(selectedId);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedId) {
            onSelectionChange([selectedId]);
        }
        handleMenuClose();
    };

    const getEntityIcon = (kind: AdminKind) => {
        switch (kind) {
            case 'clubs':
                return <SportsSoccer color="primary" />;
            case 'sports':
                return <Sports color="info" />;
            case 'users':
                return <Person color="error" />;
            case 'teams':
                return <Group color="warning" />;
            case 'pitches':
                return <LocationOn color="success" />;
            case 'cameras':
                return <CameraAlt color="secondary" />;
            default:
                return <SportsSoccer />;
        }
    };

    const getStatusChip = (item: ListItemVM) => {
        if (kind === 'users' && item.secondary) {
            const role = item.secondary as string;
            return (
                <Chip
                    label={role}
                    size="small"
                    color={role === 'tenant_admin' ? 'primary' : 'default'}
                    variant="outlined"
                />
            );
        }
        return null;
    };

    const isAllSelected = items.length > 0 && selection.length === items.length;
    const isIndeterminate = selection.length > 0 && selection.length < items.length;

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No {kind} found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try selecting a different node in the tree or adjust your search.
                </Typography>
            </Box>
        );
    }

    return (
        (kind != 'cameras' && kind != 'users') ?
        (
        kind == 'home'
        ?
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {toolbar}
            {bulkBar}

            <Box sx={{  overflow: 'auto', p: 2 }}>
                <h3>Clubs</h3>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    
                    {items.map((item) => (
                        (item.primary == 'Palermo' || item.primary == 'Lommel') &&
                        <Paper
                            key={item.id}
                            elevation={1}
                            sx={{ position: 'relative', p: 2, minHeight: 72, display: 'flex', alignItems: 'center' }}
                        >
                            {/* top-right action icons */}
                            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    aria-label={`edit ${item.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRowClick(item.id);
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    aria-label={`delete ${item.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectionChange([item.id]);
                                    }}
                                >
                                    <Delete fontSize="small" color="error" />
                                </IconButton>
                            </Box>

                            {/* card body: name only */}
                            <Box
                                onClick={() => handleRowClick(item.id)}
                                sx={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                {/* optional entity icon */}
                                {/* {getEntityIcon(kind)} */}
                                <Typography variant="subtitle1">{item.primary}</Typography>
                            </Box>
                        </Paper>
                    ))}

                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <h3>Pitches</h3>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    
                    {items.map((item) => (
                        !(item.primary == 'Palermo' || item.primary == 'Lommel') &&
                        <Paper
                            key={item.id}
                            elevation={1}
                            sx={{ position: 'relative', p: 2, minHeight: 72, display: 'flex', alignItems: 'center' }}
                        >
                            {/* top-right action icons */}
                            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    aria-label={`edit ${item.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRowClick(item.id);
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    aria-label={`delete ${item.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectionChange([item.id]);
                                    }}
                                >
                                    <Delete fontSize="small" color="error" />
                                </IconButton>
                            </Box>

                            {/* card body: name only */}
                            <Box
                                onClick={() => handleRowClick(item.id)}
                                sx={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                {/* optional entity icon */}
                                {/* {getEntityIcon(kind)} */}
                                <Typography variant="subtitle1">{item.primary}</Typography>
                            </Box>
                        </Paper>
                    ))}

                </Box>
            </Box>

            {/* <Pagination
                page={page || 1}
                pageSize={pageSize || 20}
                total={total || 0}
                onPageChange={(newPage) => onPageChange?.(newPage)}
                onPageSizeChange={(newPageSize) => onPageChange?.(newPageSize)}
            /> */}
        </Box>
        :
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {toolbar}
            {bulkBar}

            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    {items.map((item) => (
                        <Paper
                            key={item.id}
                            elevation={1}
                            sx={{ position: 'relative', p: 2, minHeight: 72, display: 'flex', alignItems: 'center' }}
                        >
                            {/* top-right action icons */}
                            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    aria-label={`edit ${item.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRowClick(item.id);
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    aria-label={`delete ${item.primary}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectionChange([item.id]);
                                    }}
                                >
                                    <Delete fontSize="small" color="error" />
                                </IconButton>
                            </Box>

                            {/* card body: name only */}
                            <Box
                                onClick={() => handleRowClick(item.id)}
                                sx={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                {/* optional entity icon */}
                                {/* {getEntityIcon(kind)} */}
                                <Typography variant="subtitle1">{item.primary}</Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* <Pagination
                page={page || 1}
                pageSize={pageSize || 20}
                total={total || 0}
                onPageChange={(newPage) => onPageChange?.(newPage)}
                onPageSizeChange={(newPageSize) => onPageChange?.(newPageSize)}
            /> */}
        </Box>
        )
        :
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {toolbar}
            {bulkBar}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <TableContainer component={Paper} elevation={0}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={isIndeterminate}
                                        checked={isAllSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        inputProps={{ 'aria-label': 'select all' }}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const isSelected = selection.includes(item.id);
                                const isFocused = focusedId === item.id;

                                return (
                                    <TableRow
                                        key={item.id}
                                        hover
                                        selected={isSelected}
                                        onClick={() => handleRowClick(item.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            // Focused state: different background color
                                            backgroundColor: isFocused ? 'action.hover' : 'inherit',
                                            // Focused state: left border highlight
                                            borderLeft: isFocused ? '3px solid' : '3px solid transparent',
                                            borderLeftColor: isFocused ? 'primary.main' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: isFocused ? 'action.selected' : 'action.hover',
                                            }
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selection.includes(item.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectItem(item.id, e.target.checked);
                                                }}
                                                inputProps={{ 'aria-label': `select ${item.primary}` }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {/* {getEntityIcon(kind)} */}
                                                <Typography variant="body2">{item.primary}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.secondary}
                                                </Typography>
                                                {/* {getStatusChip(item)} */}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, item.id)}
                                                aria-label={`actions for ${item.primary}`}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    Delete
                </MenuItem>
            </Menu>

            {/* <Pagination
                page={page || 1}
                pageSize={pageSize || 20}
                total={total || 0}
                onPageChange={(newPage) => onPageChange?.(newPage)}
                onPageSizeChange={(newPageSize) => onPageChange?.(newPageSize)}
            /> */}
        </Box>
    );
};
