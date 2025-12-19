import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
    // Get initial mode from localStorage or system preference, default to 'dark'
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            ...(mode === 'dark' ? {
                // Dark Mode Palette
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                    glass: 'rgba(255, 255, 255, 0.05)',
                    glassBorder: 'rgba(255, 255, 255, 0.1)',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                },
                primary: {
                    main: '#FF8E53', // Brand Orange
                },
                secondary: {
                    main: '#FE6B8B', // Brand Pink
                },
            } : {
                // Light Mode Palette
                background: {
                    default: '#f4f6f8',
                    paper: '#ffffff',
                    glass: 'rgba(255, 255, 255, 0.7)', // Frosted glass for light mode
                    glassBorder: 'rgba(0, 0, 0, 0.05)',
                },
                text: {
                    primary: '#121212',
                    secondary: 'rgba(0, 0, 0, 0.6)',
                },
                primary: {
                    main: '#FF8E53',
                },
                secondary: {
                    main: '#FE6B8B',
                },
            }),
        },
        typography: {
            fontFamily: '"Be Vietnam Pro", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 700 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 700 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
        },
        components: {
            // Global overrides
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '16px',
                    },
                },
            },
        },
    }), [mode]);

    // Custom helper for glassmorphism styles based on mode
    const glassSx = {
        bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
        boxShadow: mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, glassSx }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
