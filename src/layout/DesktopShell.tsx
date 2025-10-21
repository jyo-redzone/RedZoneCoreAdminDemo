import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface DesktopShellProps {
    children: ReactNode;
}

export const DesktopShell = ({ children }: DesktopShellProps) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gridTemplateRows: '64px 1fr',
                gridTemplateAreas: `
                    "header header"
                    "tree list"
                `,
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            {children}
        </Box>
    );
};
