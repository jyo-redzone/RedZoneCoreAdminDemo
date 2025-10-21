import { Box, Drawer } from '@mui/material';
import { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
  drawerOpen: boolean;
  onDrawerClose: () => void;
  treeNav?: ReactNode;
}

export const MobileShell = ({ children, drawerOpen, onDrawerClose, treeNav }: MobileShellProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
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
