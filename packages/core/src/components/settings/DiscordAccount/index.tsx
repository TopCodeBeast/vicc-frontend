import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import { useCurrentUserContext } from '@core/contexts/currentUser';

import OAuthAccount from '../OAuthAccount';

const DiscordAccount = () => {
  const { currentUser } = useCurrentUserContext();

  if (!currentUser) return null;

  const { discordUsername } = currentUser.profile;

  return (
    <OAuthAccount
      nickname={discordUsername}
      provider="discord"
      icon={faDiscord}
    />
  );
};

export default DiscordAccount;
