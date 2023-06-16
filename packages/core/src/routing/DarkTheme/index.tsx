import React, { FC, ReactNode, createContext, useContext, useEffect } from 'react';

type Props = { children: ReactNode };

export const DarkThemeContext = createContext({
  withinDarkTheme: false,
});

export const DarkTheme = ({ children }: Props) => {
  const { withinDarkTheme } = useContext(DarkThemeContext);

  if (withinDarkTheme && process.env.NODE_ENV !== 'production') {
    throw new Error(`Invalid DOM: DarkTheme cannot be children of DarkTheme.`);
  }

  return (
    <DarkThemeContext.Provider value={{ withinDarkTheme: true }}>
      {children}
    </DarkThemeContext.Provider>
  );
};
