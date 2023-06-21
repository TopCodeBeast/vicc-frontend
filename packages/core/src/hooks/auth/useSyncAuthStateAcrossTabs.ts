import { useEffect } from 'react';

import { AuthBroadCastChannel } from '@core/lib/broadcastChannel';

const useSyncAuthStateAcrossTabs = () => {
  useEffect(() => {
    AuthBroadCastChannel.on(message => {
      if (message === 'logged_out') {
        window.location.reload();
      }
    });
  }, []);
};

export default useSyncAuthStateAcrossTabs;
