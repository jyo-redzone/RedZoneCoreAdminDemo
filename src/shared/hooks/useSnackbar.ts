import { useCallback, useState } from 'react';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = useCallback(
        (
            message: string,
            severity: SnackbarState['severity'] = 'info',
            action?: SnackbarState['action'],
        ) => {
            setSnackbar({
                open: true,
                message,
                severity,
                action,
            });
        },
        [],
    );

    const hideSnackbar = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    const showSuccess = useCallback(
        (message: string, action?: SnackbarState['action']) => {
            showSnackbar(message, 'success', action);
        },
        [showSnackbar],
    );

    const showError = useCallback(
        (message: string, action?: SnackbarState['action']) => {
            showSnackbar(message, 'error', action);
        },
        [showSnackbar],
    );

    const showWarning = useCallback(
        (message: string, action?: SnackbarState['action']) => {
            showSnackbar(message, 'warning', action);
        },
        [showSnackbar],
    );

    const showInfo = useCallback(
        (message: string, action?: SnackbarState['action']) => {
            showSnackbar(message, 'info', action);
        },
        [showSnackbar],
    );

    return {
        snackbar,
        showSnackbar,
        hideSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
};
