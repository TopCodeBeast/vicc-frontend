import { TypedDocumentNode, gql } from '@apollo/client';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';

import { UserGroupStatus_so5UserGroup } from './__generated__/index.graphql';

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
  so5UserGroup: UserGroupStatus_so5UserGroup;
};
export const UserGroupStatus = ({ so5UserGroup }: Props) => {
  let status = Statuses.LOCKED;

  if (so5UserGroup.myMembership) {
    status = Statuses.JOINED;
  } else if (so5UserGroup.upcomingSo5Leaderboard?.canCompose.value) {
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
  so5UserGroup: gql`
    fragment UserGroupStatus_so5UserGroup on So5UserGroup {
      id
      status
      upcomingSo5Leaderboard {
        slug
        canCompose {
          value
        }
      }
      myMembership {
        id
      }
    }
  ` as TypedDocumentNode<UserGroupStatus_so5UserGroup>,
};

export default UserGroupStatus;
