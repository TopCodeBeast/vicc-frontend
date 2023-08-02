import { ComponentType } from 'react';
import styled from 'styled-components';

import { EmptyLeaderboard } from '@football/components/so5/Leaderboard/EmptyLeaderboard';

interface Props<T> {
  Row: ComponentType<
    React.PropsWithChildren<{
      manager: T;
      onClick: () => void;
      highlight: boolean;
    }>
  >;
  onRowClick?: (item: T) => void;
  isMe: (item: T) => boolean;
  rankings: T[];
  myRanking?: T;
  onlyFollowed?: boolean;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  width: 100%;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const Leaderboard = <T extends { id: string }>({
  Row,
  onRowClick = () => {},
  isMe,
  rankings,
  myRanking,
  onlyFollowed,
}: Props<T>) => {
  const myPosition = rankings.findIndex(isMe);
  const numberOfParticipants = rankings?.length;
  const numberOfParticipantsWithoutMe =
    myPosition === -1 ? numberOfParticipants : numberOfParticipants - 1;
  const managersToDisplay = onlyFollowed
    ? numberOfParticipantsWithoutMe
    : numberOfParticipants;
  const showMeFirst =
    myRanking && (myPosition < 0 || myPosition > 5 || !managersToDisplay);

  return (
    <Root>
      {showMeFirst && (
        <Row
          onClick={() => onRowClick(myRanking)}
          manager={myRanking}
          highlight
        />
      )}
      <List>
        {managersToDisplay ? (
          rankings.map(manager => {
            return (
              <Row
                key={manager.id}
                onClick={() => onRowClick(manager)}
                manager={manager}
                highlight={isMe(manager)}
              />
            );
          })
        ) : (
          <EmptyLeaderboard onlyFollowed={onlyFollowed} />
        )}
      </List>
    </Root>
  );
};
