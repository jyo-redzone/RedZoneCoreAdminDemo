import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { Path } from '../model/types';

export const useResponsiveNodePath = (path: Path) => {
  const isMobile = useMediaQuery('(max-width:767px)');
  const [pathHistory, setPathHistory] = useState<Path[]>([]);

  // Update path history when path changes
  useEffect(() => {
    setPathHistory((prev) => {
      const newHistory = [...prev];
      const lastPath = newHistory[newHistory.length - 1];

      // Only add if path is different from last path
      if (JSON.stringify(lastPath) !== JSON.stringify(path)) {
        newHistory.push(path);
      }

      return newHistory;
    });
  }, [path]);

  const goBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop(); // Remove current path
      const previousPath = newHistory[newHistory.length - 1];
      setPathHistory(newHistory);
      return previousPath;
    }
    return path;
  };

  const canGoBack = pathHistory.length > 1;

  return {
    isMobile,
    pathHistory,
    goBack,
    canGoBack,
  };
};
