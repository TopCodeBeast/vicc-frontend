import { faTwitter } from '@fortawesome/free-brands-svg-icons';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import OAuthAccount from '../OAuthAccount';

const TwitterAccount = () => {
  const { currentUser } = useCurrentUserContext();

  if (!currentUser) return null;

  const { twitterUsername } = currentUser.profile;

  return (
    <OAuthAccount
      nickname={twitterUsername && `@${twitterUsername}`}
      provider="twitter"
      icon={faTwitter}
    />
  );
};

export default TwitterAccount;
