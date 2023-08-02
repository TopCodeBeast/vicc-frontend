import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Injured } from '@sorare/core/src/atoms/icons/Injured';
import { Suspended } from '@sorare/core/src/atoms/icons/Suspended';
import { Text14, Text18 } from '@sorare/core/src/atoms/typography';
import { playerUnavailability } from '@sorare/core/src/lib/glossary';

import { PlayerUnavailabilityPanel_player } from './__generated__/index.graphql';

type PlayerUnavailabilityPanel_player_activeInjuries =
  PlayerUnavailabilityPanel_player['activeInjuries'][number];

type PlayerUnavailabilityPanel_player_activeSuspensions =
  PlayerUnavailabilityPanel_player['activeSuspensions'][number];

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const FlexWrapper = styled.div`
  display: flex;
  gap: var(--unit);
  overflow-x: auto;
`;
const UnavailabilityContainer = styled.div`
  flex: 1 1 0;
  min-width: 200px;
  display: grid;
  grid-template-areas: 'title title' 'content gap';
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-200);
  gap: var(--unit);
`;
const UnavailabilityTitle = styled.div`
  grid-area: title;
  display: flex;
  gap: var(--unit);
  align-items: center;
`;
const UnavailabilityContent = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const InjuredIcon = styled(Injured)`
  color: var(--c-red-600);
`;
const SuspendedIcon = styled(Suspended)`
  color: var(--c-red-600);
`;

const messages = defineMessages({
  panelTitle: {
    id: 'ComposeTeam.PlayerDetailsDialog.PlayerUnavailability.Title',
    defaultMessage: 'Injuries and suspensions',
  },
});

const Injury = ({
  kind,
  startDate,
  expectedEndDate,
}: PlayerUnavailabilityPanel_player_activeInjuries) => {
  return (
    <UnavailabilityContainer>
      <UnavailabilityTitle>
        <InjuredIcon />
        <FormattedMessage {...playerUnavailability.injuryTitle} />
      </UnavailabilityTitle>
      <UnavailabilityContent>
        <Text14>
          {kind}
          {startDate && (
            <>
              {' '}
              <FormattedMessage
                {...playerUnavailability.unavailableSince}
                values={{
                  unavailableSince: new Date(startDate),
                }}
              />
            </>
          )}
        </Text14>
        <Text14>
          {expectedEndDate ? (
            <FormattedMessage
              {...playerUnavailability.expectedReturnDate}
              values={{
                date: new Date(expectedEndDate),
              }}
            />
          ) : (
            <FormattedMessage {...playerUnavailability.unknownReturnDate} />
          )}
        </Text14>
      </UnavailabilityContent>
    </UnavailabilityContainer>
  );
};

const Suspension = ({
  competition,
  reason,
  matches,
  endDate,
}: PlayerUnavailabilityPanel_player_activeSuspensions) => {
  return (
    <UnavailabilityContainer>
      <UnavailabilityTitle>
        <SuspendedIcon />
        <FormattedMessage {...playerUnavailability.suspendedTitle} />
      </UnavailabilityTitle>
      <UnavailabilityContent>
        <Text14>
          {reason}
          {matches && (
            <>
              {' '}
              <FormattedMessage
                {...playerUnavailability.gamesUnavailableCount}
                values={{
                  gamesCount: matches,
                  competition: competition.displayName,
                }}
              />
            </>
          )}
        </Text14>
        <Text14>
          {endDate ? (
            <FormattedMessage
              {...playerUnavailability.expectedReturnDate}
              values={{
                date: new Date(endDate),
              }}
            />
          ) : (
            <FormattedMessage {...playerUnavailability.unknownReturnDate} />
          )}
        </Text14>
      </UnavailabilityContent>
    </UnavailabilityContainer>
  );
};

type Props = {
  player: PlayerUnavailabilityPanel_player;
};
const PlayerUnavailabilityPanel = ({
  player: { activeInjuries, activeSuspensions },
}: Props) => {
  if (!activeInjuries.length && !activeSuspensions.length) return null;

  return (
    <Root>
      <Text18 bold>
        <FormattedMessage {...messages.panelTitle} />
      </Text18>
      <FlexWrapper>
        {activeInjuries.map(injury => (
          <Injury key={injury.id} {...injury} />
        ))}
        {activeSuspensions.map(suspension => (
          <Suspension key={suspension.id} {...suspension} />
        ))}
      </FlexWrapper>
    </Root>
  );
};

PlayerUnavailabilityPanel.fragments = {
  player: gql`
    fragment PlayerUnavailabilityPanel_player on Player {
      slug
      activeInjuries {
        id
        kind
        startDate
        expectedEndDate
      }
      activeSuspensions {
        id
        competition {
          slug
          id
          displayName
        }
        matches
        reason
        startDate
        endDate
      }
    }
  ` as TypedDocumentNode<PlayerUnavailabilityPanel_player>,
};

export default PlayerUnavailabilityPanel;
