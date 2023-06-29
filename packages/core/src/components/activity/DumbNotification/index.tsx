import { gql } from '@apollo/client';
import classNames from 'classnames';
import { parseISO } from 'date-fns';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import { Caption, Text14 } from '@core/atoms/typography';
import UninteractiveToken from '@core/components/token/UninteractiveToken';
import Avatar from '@core/components/user/Avatar';
import { useIntlContext } from '@core/contexts/intl';
import { sportsLabelsMessages } from '@core/lib/glossary';
import { Link } from '@core/routing/Link';

import {
  DumbNotification_tokenPicture,
  DumbNotification_userAvatar,
} from './__generated__/index.graphql';

type Props = {
  createdAt: string;
  userAvatar?: DumbNotification_userAvatar | null;
  sport: Sport | null;
  title: string | ReactNode;
  tokenPicture?: DumbNotification_tokenPicture | null;
  content?: ReactNode;
  link?: string;
  read?: boolean;
  onClick?: () => void;
  inModale?: boolean;
};

const Root = styled.span`
  width: 100%;
  display: flex;
  text-align: left;
  gap: var(--double-unit);
  padding: var(--double-unit) var(--double-unit);
  border-bottom: 1px solid var(--c-neutral-200);
  color: var(--c-neutral-1000);
  cursor: pointer;

  &.read {
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }

  &.inModale {
    border-color: var(--c-neutral-300);
    &:hover {
      background-color: rgba(var(--c-rgb-neutral-400), 0.6);
    }
  }

  &:hover {
    background-color: var(--c-neutral-300);
    color: var(--c-neutral-1000);
    opacity: 1;
  }
`;

const SorareContainer = styled.div`
  width: calc(5 * var(--unit));
  height: calc(5 * var(--unit));
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--c-brand-800);
  border-radius: var(--unit);
`;
const StyledSorareLogo = styled(SorareLogo)`
  width: calc(4 * var(--unit));
`;
const Infos = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Content = styled.div`
  background-color: var(--c-neutral-200);
  border-radius: var(--unit);
  padding: var(--double-unit);
  display: flex;
  gap: var(--double-unit);
  align-items: center;

  &.inModale {
    background-color: var(--c-neutral-300);
  }
`;
const ImgContainer = styled.div`
  width: 42px;
`;

export const DumbNotification = ({
  createdAt,
  title,
  tokenPicture,
  content,
  link,
  sport,
  read,
  userAvatar,
  onClick,
  inModale,
}: Props) => {
  const { formatDistanceToNow } = useIntlContext();
  return (
    <Root
      as={link ? Link : 'div'}
      {...(link ? { to: link } : {})}
      onClick={onClick}
      className={classNames({ inModale, read })}
    >
      <div>
        {userAvatar ? (
          <Avatar variant="medium" user={userAvatar} />
        ) : (
          <SorareContainer>
            <StyledSorareLogo />
          </SorareContainer>
        )}
      </div>
      <Infos>
        <div>
          <Text14>{title}</Text14>
          <Caption color="var(--c-neutral-600)">
            {sport ? (
              <FormattedMessage {...sportsLabelsMessages[sport]} />
            ) : (
              <FormattedMessage
                id="Notification.global"
                defaultMessage="Global"
              />
            )}
            {' • '}
            {formatDistanceToNow(parseISO(createdAt))}
          </Caption>
        </div>
        {tokenPicture && (
          <Content className={classNames({ inModale })}>
            <ImgContainer>
              <UninteractiveToken token={tokenPicture} />
            </ImgContainer>
            {content}
          </Content>
        )}
      </Infos>
    </Root>
  );
};

DumbNotification.fragments = {
  avatarUser: gql`
    fragment DumbNotification_userAvatar on PublicUserInfoInterface {
      slug
      ...Avatar_publicUserInfoInterface
    }
    ${Avatar.fragments.publicUserInfoInterface}
  `,
  tokenPicture: gql`
    fragment DumbNotification_tokenPicture on Token {
      assetId
      slug
      ...UninteractiveToken_token
    }
    ${UninteractiveToken.fragments.token}
  `,
};
