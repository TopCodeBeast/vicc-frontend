import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useConnectionContext } from 'contexts/connection';
import { useCurrentUserContext } from 'contexts/currentUser';

import useAfterLoggedInTarget from './useAfterLoggedInTarget';
import useTruncatedLocation from './useTruncatedLocation';

export default function useLoggedCallback<T>(callback: (arg: T) => void) {
  const { currentUser } = useCurrentUserContext();
  const { signIn } = useConnectionContext();
  const location = useTruncatedLocation();
  const navigate = useNavigate();
  const afterLoggedInTarget = useAfterLoggedInTarget();

  return useCallback(
    (arg: T) => {
      if (currentUser) {
        callback(arg);
      } else {
        if (!afterLoggedInTarget) {
          navigate(location, {
            state: { afterLoggedInTarget: location },
            replace: true,
          });
        }
        signIn();
      }
    },
    [currentUser, callback, afterLoggedInTarget, signIn, navigate, location]
  );
}
