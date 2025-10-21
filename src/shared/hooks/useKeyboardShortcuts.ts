import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        const key = event.key.toLowerCase();
        const shortcutKey = `ctrl+${key}`;

        if (shortcuts[shortcutKey]) {
          event.preventDefault();
          shortcuts[shortcutKey]!();
        }
      }

      // Check for single key shortcuts
      if (shortcuts[event.key]) {
        event.preventDefault();
        shortcuts[event.key]!();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
