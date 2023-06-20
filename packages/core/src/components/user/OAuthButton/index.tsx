import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import OAuthForm from 'components/user/OAuthForm';

type Props = {
  provider: 'discord' | 'twitter' | 'google_oauth2' | 'facebook';
  children: ReactNode;
};

const SubmitButton = styled(Button)`
  &.discord {
    background-color: var(--c-social-discord);
    &:hover {
      background-color: rgba(var(--c-rgb-social-discord), 0.9);
    }
  }
  &.twitter {
    background-color: var(--c-social-twitter);
    &:hover {
      background-color: rgba(var(--c-rgb-social-twitter), 0.9);
    }
  }
  &.google_oauth2 {
    background-color: var(--c-social-google);
    &:hover {
      background-color: rgba(var(--c-rgb-social-google), 0.9);
    }
  }
  &.facebook {
    background-color: var(--c-social-facebook);
    &:hover {
      background-color: rgba(var(--c-rgb-social-facebook), 0.9);
    }
  }
`;

export const OAuthButton = (props: Props) => {
  const { provider, children } = props;

  return (
    <OAuthForm provider={provider}>
      <SubmitButton type="submit" className={classnames(provider)} small>
        {children}
      </SubmitButton>
    </OAuthForm>
  );
};

export default OAuthButton;
