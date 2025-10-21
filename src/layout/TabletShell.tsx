import { Box, Drawer } from '@mui/material';
import { ReactNode } from 'react';

interface TabletShellProps {
  children: ReactNode;
  drawerOpen: boolean;
  onDrawerClose: () => void;
  treeNav?: ReactNode;
}

export const TabletShell = ({ children, drawerOpen, onDrawerClose, treeNav }: TabletShellProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
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

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={onDrawerClose}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            top: 64, // Below the header
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        {treeNav}
      </Drawer>
    </>
  );
};
