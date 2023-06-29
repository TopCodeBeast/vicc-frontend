import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import OAuthButton from '@core/components/user/OAuthButton';
import Disconnect from '@core/components/user/OAuthDisconnect';
import { tabletAndAbove } from '@core/style/mediaQuery';

interface Props {
  nickname: string | null;
  provider: 'discord' | 'twitter' | 'google_oauth2' | 'facebook';
  icon: IconProp;
}

const providerName = (provider: string) => {
  if (provider === 'google_oauth2') {
    return 'google';
  }
  return provider;
};

/*
 * The nickname is the user's email in case of OmniauthIdentities for providers
 * `facebook` and `google_oauth_2`. It is the user nickname for others.
 */
const connectedEmail = (provider: string, nickname: string) => {
  switch (provider) {
    case 'google_oauth2':
    case 'facebook':
      return nickname;
    default:
      return null;
  }
};

const Connected = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-direction: column;
  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;
const UsernameInfo = styled.div`
  display: flex;
  gap: var(--double-unit);
  padding: calc(1 * var(--unit)) 0;
  align-items: center;
`;
const Icons = styled.div`
  position: relative;
`;
const Icon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.twitter {
    background-color: var(--c-social-twitter);
  }
  &.discord {
    background-color: var(--c-social-discord);
  }
  &.google_oauth2 {
    background-color: var(--c-social-google);
  }
  &.facebook {
    background-color: var(--c-social-facebook);
  }
`;
const CheckIcon = styled.div`
  width: 16px;
  height: 16px;
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: var(--c-neutral-1000);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 2px var(--c-neutral-100);
`;

const Social = styled(Text16)`
  text-transform: capitalize;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const OAuthAccount = ({ nickname, provider, icon }: Props) => {
  return (
    <div>
      <Connected>
        <UsernameInfo>
          <Icons>
            <Icon className={provider}>
              <FontAwesomeIcon
                color="var(--c-static-neutral-100)"
                icon={icon}
              />
            </Icon>
            {nickname && (
              <CheckIcon>
                <FontAwesomeIcon
                  color="var(--c-neutral-100)"
                  width="8"
                  icon={faCheck}
                />
              </CheckIcon>
            )}
          </Icons>
          {nickname && (
            <div>
              <Social>{providerName(provider)}</Social>
              <Text16 color="var(--c-neutral-600)">{nickname}</Text16>
            </div>
          )}
        </UsernameInfo>
        <Buttons>
          {nickname ? (
            <Disconnect
              provider={provider}
              email={connectedEmail(provider, nickname)}
            />
          ) : (
            <OAuthButton provider={provider}>
              <FormattedMessage id="OAuthAccount.link" defaultMessage="Link" />
            </OAuthButton>
          )}
        </Buttons>
      </Connected>
    </div>
  );
};

export default OAuthAccount;
