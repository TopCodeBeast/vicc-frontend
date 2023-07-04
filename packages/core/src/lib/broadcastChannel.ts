let authChannel: BroadcastChannel | undefined;
if (window.BroadcastChannel) {
  authChannel = new BroadcastChannel('auth');
}

export type AuthBroadCastChannelMessage = 'logged_out';

export const AuthBroadCastChannel = {
  on: (f: (e: AuthBroadCastChannelMessage) => void) => {
    if (authChannel) {
      authChannel.onmessage = e => f(e.data);
    }
  },
  postMessage: (message: AuthBroadCastChannelMessage) => {
    if (authChannel) {
      authChannel.postMessage(message);
    }
  },
};
