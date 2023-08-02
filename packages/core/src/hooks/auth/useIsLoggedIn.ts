import { useCurrentUserContext } from '@core/contexts/currentUser';

const useIsLoggedIn = () => {
  const { currentUser } = useCurrentUserContext();
  return !!currentUser;
};

export default useIsLoggedIn;
