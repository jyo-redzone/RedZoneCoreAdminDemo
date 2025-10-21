import { useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import { DesktopShell } from './DesktopShell';
import { MobileShell } from './MobileShell';
import { TabletShell } from './TabletShell';

interface ResponsiveLayoutProps {
  children: ReactNode;
  drawerOpen: boolean;
  onDrawerClose: () => void;
  treeNav?: ReactNode;
}

export const ResponsiveLayout = ({ children, drawerOpen, onDrawerClose, treeNav }: ResponsiveLayoutProps) => {
  const isDesktop = useMediaQuery('(min-width:1200px)');
  const isTablet = useMediaQuery('(min-width:768px) and (max-width:1199px)');

  if (isDesktop) {
    return <DesktopShell>{children}</DesktopShell>;
  }

  if (isTablet) {
    return <TabletShell drawerOpen={drawerOpen} onDrawerClose={onDrawerClose} treeNav={treeNav}>{children}</TabletShell>;
  }

  return <MobileShell drawerOpen={drawerOpen} onDrawerClose={onDrawerClose} treeNav={treeNav}>{children}</MobileShell>;
};
