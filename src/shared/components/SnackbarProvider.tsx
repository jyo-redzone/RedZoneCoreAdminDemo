import { Alert, Button, Snackbar } from '@mui/material';
import { createContext, ReactNode, useContext } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';

interface SnackbarContextType {
    showSuccess: (message: string, action?: { label: string; onClick: () => void }) => void;
    showError: (message: string, action?: { label: string; onClick: () => void }) => void;
    showWarning: (message: string, action?: { label: string; onClick: () => void }) => void;
    showInfo: (message: string, action?: { label: string; onClick: () => void }) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbarContext = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbarContext must be used within a SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const { snackbar, hideSnackbar, showSuccess, showError, showWarning, showInfo } = useSnackbar();

    return (
        <SnackbarContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={hideSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    action={
                        snackbar.action && (
                            <Button color="inherit" size="small" onClick={snackbar.action.onClick}>
                                {snackbar.action.label}
                            </Button>
                        )
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
