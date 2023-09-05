import { TypedDocumentNode, gql } from '@apollo/client';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';

import { UserGroupStatus_vicc5UserGroup } from './__generated__/index.graphql';

const Root = styled.div`
  width: auto;
  padding: var(--half-unit) var(--unit);
  border-radius: 100px;
  background-color: var(--c-neutral-400);
  color: var(--c-neutral-700);
  &.joined {
    background-color: var(--c-green-600);
  }
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

enum Statuses {
  LOCKED,
  JOIN,
  JOINED,
}

type StatusProps = { status: Statuses };
const Status = ({ status }: StatusProps) => {
  if (status === Statuses.JOINED) {
    return (
      <FormattedMessage
        id="UserGroupStatus.Joined.title"
        defaultMessage="Joined"
      />
    );
  }
  if (status === Statuses.LOCKED) {
    return (
      <FlexContainer>
        <FontAwesomeIcon icon={faLock} size="xs" />
        <FormattedMessage
          id="UserGroupStatus.Locked.title"
          defaultMessage="Locked"
        />
      </FlexContainer>
    );
  }
  return (
    <FormattedMessage id="UserGroupStatus.Join.title" defaultMessage="Join" />
  );
};

type Props = {
  vicc5UserGroup: UserGroupStatus_vicc5UserGroup;
};
export const UserGroupStatus = ({ vicc5UserGroup }: Props) => {
  let status = Statuses.LOCKED;

  if (vicc5UserGroup.myMembership) {
    status = Statuses.JOINED;
  } else if (vicc5UserGroup.upcomingVicc5Leaderboard?.canCompose.value) {
    status = Statuses.JOIN;
  }

  return (
    <Root className={classnames({ joined: status === Statuses.JOINED })}>
      <Caption as="div" color="var(--c-neutral-1000)" uppercase bold>
        <Status status={status} />
      </Caption>
    </Root>
  );
};

UserGroupStatus.fragments = {
  vicc5UserGroup: gql`
    fragment UserGroupStatus_vicc5UserGroup on Vicc5UserGroup {
      id
      status
      upcomingVicc5Leaderboard {
        slug
        canCompose {
          value
        }
      }
      myMembership {
        id
      }
    }
  ` as TypedDocumentNode<UserGroupStatus_vicc5UserGroup>,
};

export default UserGroupStatus;
