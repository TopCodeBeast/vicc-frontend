import { gql } from '@apollo/client';
import { faRepeat, faStore } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import {
  isListedOnMarket,
  isSentInDirectOffer,
} from '@sorare/core/src/lib/cards';
import { formatLineupDisplayName } from '@sorare/core/src/lib/so5';

import Context from '@football/components/so5/ComposeTeam/Context';
import DivisionLogo from '@football/components/so5/DivisionLogo';

import { PlayerStatusWarning_card } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  padding: var(--unit) var(--intermediate-unit);
  background: var(--c-neutral-400);
  gap: var(--unit);
`;

const DivisionLogoWrapper = styled.div`
  width: var(--triple-unit);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  card: PlayerStatusWarning_card;
};

const messages = defineMessages({
  usedInAnotherLineup: {
    id: 'BenchCard.usedInAnotherLineup',
    defaultMessage: 'Used in <b>{lineupDisplayName}</b>',
  },
  listedOnTheMarket: {
    id: 'BenchCard.listedOnTheMarket',
    defaultMessage: 'This card is <b>listed on the market</b>',
  },
  isSentInALiveOffer: {
    id: 'BenchCard.isSentInALiveOffer',
    defaultMessage: 'This card is <b>sent in a live offer</b>',
  },
});
const PlayerStatusWarning = ({ card }: Props) => {
  const { openedSo5Lineups } = card;
  const { so5Lineup, so5Leaderboard } = useContext(Context)!;

  const lineupUsingThisPlayer = openedSo5Lineups.find(openedLineup => {
    return (
      openedLineup.so5Leaderboard?.gameWeek === so5Leaderboard.gameWeek &&
      openedLineup.id !== so5Lineup.id
    );
  });

  const listedOnMarket = isListedOnMarket(card);
  const sentInDirectOffer = isSentInDirectOffer(card);

  if (!lineupUsingThisPlayer && !listedOnMarket && !sentInDirectOffer) {
    return null;
  }
  return (
    <Wrapper>
      {lineupUsingThisPlayer && (
        <>
          {lineupUsingThisPlayer.so5Leaderboard && (
            <DivisionLogoWrapper>
              <DivisionLogo
                so5Leaderboard={lineupUsingThisPlayer.so5Leaderboard}
              />
            </DivisionLogoWrapper>
          )}
          <Caption color="var(--c-neutral-1000)">
            <FormattedMessage
              {...messages.usedInAnotherLineup}
              values={{
                lineupDisplayName: formatLineupDisplayName(
                  lineupUsingThisPlayer
                ),
                b: Bold,
              }}
            />
          </Caption>
        </>
      )}
      {(listedOnMarket || sentInDirectOffer) && (
        <div>
          {listedOnMarket && (
            <Row>
              <FontAwesomeIcon
                icon={faStore}
                color="var(--c-neutral-1000)"
                size="xs"
              />
              <Caption color="var(--c-neutral-1000)">
                <FormattedMessage
                  {...messages.listedOnTheMarket}
                  values={{
                    b: Bold,
                  }}
                />
              </Caption>
            </Row>
          )}
          {sentInDirectOffer && (
            <Row>
              <FontAwesomeIcon
                icon={faRepeat}
                color="var(--c-neutral-1000)"
                size="xs"
              />
              <Caption color="var(--c-neutral-1000)">
                <FormattedMessage
                  {...messages.isSentInALiveOffer}
                  values={{
                    b: Bold,
                  }}
                />
              </Caption>
            </Row>
          )}
        </div>
      )}
    </Wrapper>
  );
};

PlayerStatusWarning.fragments = {
  card: gql`
    fragment PlayerStatusWarning_card on Card {
      slug
      assetId
      openedSo5Lineups {
        id
        name
        so5Leaderboard {
          slug
          gameWeek
          ...DivisionLogo_so5Leaderboard
        }
        ...formatLineupDisplayName_so5Lineup
      }
      ...isSentInDirectOffer_card
      ...isListedOnMarket_card
    }
    ${isListedOnMarket.fragments.card}
    ${isSentInDirectOffer.fragments.card}
    ${DivisionLogo.fragments.so5Leaderboard}
    ${formatLineupDisplayName.fragments.so5Lineup}
  `,
};

export default PlayerStatusWarning;
