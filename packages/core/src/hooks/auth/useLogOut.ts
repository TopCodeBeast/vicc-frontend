import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

import { AuthBroadCastChannel } from '@core/lib/broadcastChannel';
import useEvents from '@core/lib/events/useEvents';
import { client as httpClient } from '@core/lib/http';

const useLogout = () => {
  const client = useApolloClient();
  const track = useEvents();

  return useCallback(
    async () =>
      httpClient
        .delete('/users/sign_out.json')
        .then(async response => {
          if (response.status === 204) {
            track('[Client] Log Out');
            /*if (window.analytics) {
              window.analytics.reset();
            }*/
          }
          await client.clearStore();
          await window.location.reload();
          AuthBroadCastChannel.postMessage('logged_out');
          return response;
        })
        .catch(response => ({ error: response.error })),
    [client, track]
  );
};

export default useLogout;
