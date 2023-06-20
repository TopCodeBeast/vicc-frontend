import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

import { useCurrentUserContext } from 'contexts/currentUser';

import OAuthAccount from '../OAuthAccount';

const ConnectedOAuth = ({
  email,
  provider,
}: {
  email: string;
  provider: string;
}) => {
  if (provider.toLowerCase() === 'facebook') {
    return (
      <OAuthAccount nickname={email} provider="facebook" icon={faFacebook} />
    );
  }
  return (
    <OAuthAccount nickname={email} provider="google_oauth2" icon={faGoogle} />
  );
};

const ConnectedOAuths = () => {
  const { currentUser } = useCurrentUserContext();

  if (!currentUser) return null;

  const { connectedOauths } = currentUser;

  return (
    <div>
      {connectedOauths?.map(({ provider, email }) => (
        <ConnectedOAuth
          key={`${provider}.${email}`}
          provider={provider}
          email={email}
        />
      ))}
    </div>
  );
};

export default ConnectedOAuths;
