import { FC, ReactNode, createContext, useContext, useEffect } from 'react';

// import { MessagingContext, SetTheme } from '@sorare/wallet-shared';

type Props = { children: ReactNode };

export const DarkThemeContext = createContext({
  withinDarkTheme: false,
});

const DarkThemeContent: FC = ({ children }) => {
  // const { sendRequest } = useContext(MessagingContext)!;

  // useEffect(() => {
  //   window.document.body.classList.add('dark-theme');
  //   sendRequest<SetTheme>('setTheme', { dark: true });
  //   return () => {
  //     window.document.body.classList.remove('dark-theme');
  //     sendRequest<SetTheme>('setTheme', { dark: false });
  //   };
  // }, [sendRequest]);

  return <>{children}</>;
};

export const DarkTheme = ({ children }: Props) => {
  const { withinDarkTheme } = useContext(DarkThemeContext);

  if (withinDarkTheme && process.env.NODE_ENV !== 'production') {
    throw new Error(`Invalid DOM: DarkTheme cannot be children of DarkTheme.`);
  }

  return (
    <DarkThemeContext.Provider value={{ withinDarkTheme: true }}>
      <DarkThemeContent>{children}</DarkThemeContent>
    </DarkThemeContext.Provider>
  );
};
