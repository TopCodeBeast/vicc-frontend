import { DarkTheme } from '@sorare/core/src/routing/DarkTheme';

import AppSwitch from './AppSwitch';

export const AppRouter = () => {
  return (
    <>
      <DarkTheme>
        <AppSwitch />
      </DarkTheme>
    </>
  );
};

export default AppRouter;
