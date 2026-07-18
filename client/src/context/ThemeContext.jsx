import React, { createContext, useContext, useState, useLayoutEffect, useCallback, useMemo } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem("admin-theme") || "dark";
    });

    useLayoutEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("admin-theme", theme);
    }, [theme]);

    const setTheme = useCallback((t) => setThemeState(t), []);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);



//the <App/> in main.jsx is being rendered here in {children}
//{children} is the prop that refers to component wrapped by custom wrappers

//The purpose of the file is to provide a global state for the theme , instead of prop drilling
//as prop drilling is not optimsed option in this situations for many components