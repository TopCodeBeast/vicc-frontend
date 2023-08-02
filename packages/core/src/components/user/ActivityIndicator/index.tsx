import { TypedDocumentNode, gql } from '@apollo/client';
import { TooltipProps } from '@material-ui/core';
import { defineMessage, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import Tooltip from '@core/atoms/tooltip/Tooltip';
import { useActivityIndicator } from '@core/hooks/users/useActivityIndicator';

import { ActivityIndicator_user } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  --radius: var(--half-unit);
  --stroke: 1px;
  --gap: 2px;
  --offset-right: calc(var(--radius) / 2);
  --offset-bottom: calc(var(--radius) / 2);
`;

const ChildrenWrapper = styled.div`
  mask-image: radial-gradient(
    circle at calc(100% - var(--offset-right)) calc(100% - var(--offset-bottom)),
    transparent,
    transparent calc(var(--radius) + var(--gap)),
    black calc(var(--radius) + var(--gap)),
    black
  );
`;

const TooltipStyled = styled(Tooltip)`
  display: inline-block;
  position: absolute;
  right: calc(-1 * (var(--radius) - var(--offset-right)));
  bottom: calc(-1 * (var(--radius) - var(--offset-bottom)));
`;

const ActivityIcon = styled.div<{ $active: boolean }>`
  background-color: var(--color);
  ${({ $active }) =>
    $active
      ? css`
          background-color: var(--c-green-600);
        `
      : css`
          border: var(--stroke) solid var(--c-neutral-500);
        `}

  width: calc(2 * var(--radius));
  height: calc(2 * var(--radius));
  border-radius: var(--radius);
`;

const messages = defineMessage({
  online: {
    id: 'User.Header.online',
    defaultMessage: 'Online',
  },
  offline: {
    id: 'User.Header.offline',
    defaultMessage: 'Offline',
  },
});

type Props = {
  user: ActivityIndicator_user;
  children: React.JSX.Element;
  enterTouchDelay?: TooltipProps['enterTouchDelay'];
  style?: React.CSSProperties;
};

export const ActivityIndicator = ({
  user,
  children,
  enterTouchDelay,
  style,
}: Props) => {
  const { formatMessage } = useIntl();
  const active = useActivityIndicator(user);

  if (active === null) {
    return children;
  }
  return (
    <Wrapper style={style}>
      <ChildrenWrapper>{children}</ChildrenWrapper>

      <TooltipStyled
        title={
          <>
            {user.profile.status}
            {user.profile.status && ' ('}
            {formatMessage(active ? messages.online : messages.offline)}
            {user.profile.status && ')'}
          </>
        }
        placement="right"
        role="status"
        enterTouchDelay={enterTouchDelay}
      >
        <ActivityIcon $active={active} />
      </TooltipStyled>
    </Wrapper>
  );
};

ActivityIndicator.fragments = {
  user: gql`
    fragment ActivityIndicator_user on PublicUserInfoInterface {
      slug
      profile {
        id
        status
      }
      ...useActivityIndicator_user
    }
    ${useActivityIndicator.fragments.user}
  ` as TypedDocumentNode<ActivityIndicator_user>,
};

export default ActivityIndicator;
