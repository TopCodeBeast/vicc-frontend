import { useEffect } from 'react';

import { AuthBroadCastChannel } from '@sorare/core/src/lib/broadcastChannel';

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
