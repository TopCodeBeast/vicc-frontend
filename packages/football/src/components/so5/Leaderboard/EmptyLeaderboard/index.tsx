import { faUserFriends } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title2 } from '@sorare/core/src/atoms/typography';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  background: var(--c-neutral-200);
  border-radius: var(--double-unit);
`;
const NeedToFollow = styled(Text16)`
  margin-top: var(--half-unit);
  color: var(--c-neutral-600);
`;

export const EmptyLeaderboard = ({
  onlyFollowed,
}: {
  onlyFollowed?: boolean;
}) => {
  return (
    <Root>
      <FontAwesomeIcon
        icon={faUserFriends}
        size="2x"
        color="var(--c-neutral-1000)"
      />
      {onlyFollowed ? (
        <div>
          <Title2 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="Lobby.EmptyLeaderboard.noManagersFound"
              defaultMessage="Follow a manager"
            />
          </Title2>
          <NeedToFollow>
            <FormattedMessage
              id="Lobby.EmptyLeaderboard.needToFollow"
              defaultMessage="You need to follow managers participating in this tournament to see them on this leaderboard."
            />
          </NeedToFollow>
        </div>
      ) : (
        <div>
          <Title2 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="Lobby.EmptyLeaderboard.noManagers"
              defaultMessage="Empty leaderboard"
            />
          </Title2>
          <NeedToFollow>
            <FormattedMessage
              id="Lobby.EmptyLeaderboard.empty"
              defaultMessage="Nobody participated in this competition"
            />
          </NeedToFollow>
        </div>
      )}
    </Root>
  );
};
