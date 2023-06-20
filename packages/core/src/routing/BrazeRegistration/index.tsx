import braze from '@braze/web-sdk';
import { useEffect } from 'react';

import { BRAZE_API_KEY, BRAZE_SDK_ENDPOINT } from 'config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';

export const BrazeRegistration = () => {
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (BRAZE_API_KEY && BRAZE_SDK_ENDPOINT && currentUser?.id) {
      braze.initialize(BRAZE_API_KEY, {
        baseUrl: BRAZE_SDK_ENDPOINT,
        doNotLoadFontAwesome: true,
      });
      braze.changeUser(idFromObject(currentUser.id));
      braze.openSession();
    }
  }, [currentUser?.id]);

  return null;
};

export default BrazeRegistration;
