import { FirstPage, LastPage } from '@mui/icons-material';
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination as MuiPagination,
    Select,
    Typography,
} from '@mui/material';

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export const Pagination = ({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) => {
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    const handlePageChange = (_: unknown, newPage: number) => {
        onPageChange(newPage);
    };

    const handleFirstPage = () => {
        onPageChange(1);
    };

    const handleLastPage = () => {
        onPageChange(totalPages);
    };

    if (total === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {startItem}-{endItem} of {total}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel>Per page</InputLabel>
                    <Select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        label="Per page"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handleFirstPage} disabled={page === 1} aria-label="first page">
                    <FirstPage />
                </IconButton>
                <MuiPagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                    showFirstButton={false}
                    showLastButton={false}
                />
                <IconButton onClick={handleLastPage} disabled={page === totalPages} aria-label="last page">
                    <LastPage />
                </IconButton>
            </Box>
        </Box>
    );
};
