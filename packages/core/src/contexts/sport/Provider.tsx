import { ReactNode } from 'react';
import { Params, generatePath } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import { CRICKET_PATH, MLB_PATH, NBA_PATH } from '@core/constants/routes';
import useStoreLastVisitedSport from '@core/hooks/useStoreLastVisitedSport';

import SportContextProvider from '.';

interface Props {
  children: ReactNode;
  sport?: Sport;
}

export const appsPaths = {
  [Sport.CRICKET]: CRICKET_PATH,
  [Sport.BASEBALL]: MLB_PATH,
  [Sport.NBA]: NBA_PATH,
};

const SportProvider = ({ children, sport: defaultSport }: Props) => {
  useStoreLastVisitedSport(defaultSport);
  return (
    <SportContextProvider
      value={{
        sport: defaultSport,
        generateSportPath: (
          path,
          {
            params,
            sport = defaultSport,
          }: { params?: Params; sport?: Sport } = {}
        ) => generatePath(`${sport ? appsPaths[sport] : ''}${path}`, params),
      }}
    >
      {children}
    </SportContextProvider>
  );
};

export default SportProvider;
