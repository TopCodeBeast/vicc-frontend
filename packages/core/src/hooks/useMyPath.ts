import { Params, generatePath } from 'react-router-dom';

import { useCurrentUserContext } from '@core/contexts/currentUser';

const useMyPath = () => {
  const { currentUser } = useCurrentUserContext();
  return (route: string, params?: Params, slugKey = 'slug') => {
    if (!currentUser) return generatePath(route, params);
    return generatePath(route, { ...params, [slugKey]: currentUser.slug });
  };
};

export default useMyPath;
