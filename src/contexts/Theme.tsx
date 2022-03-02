import React, { createContext, useContext, useState } from 'react';

const defaultTheme: ThemeOptions = 'light';
const ThemeContext = createContext({
  theme: (window.localStorage.getItem('theme') || defaultTheme) as ThemeOptions,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
});

type ThemeOptions = 'light' | 'dark';

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: {children: any}) {
  const [theme, setTheme] = useState((window.localStorage.getItem('theme') || defaultTheme) as ThemeOptions);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    toggleTheme: () => {
      if (theme === 'light') {
        window.localStorage.setItem('theme', 'dark');
        setTheme('dark');
      } else {
        window.localStorage.setItem('theme', 'light');
        setTheme('light');
      }
    },
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
