import { gql } from '@apollo/client';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import { Text16, Text20 } from '@sorare/core/src/atoms/typography';

import AverageScore from '@sorare/football/src/components/so5/AverageScore';
import CardBonus from '@sorare/football/src/components/so5/CardProperties/CardBonus';
import { positionShortNames } from 'lib/so5';

import {
  PlayerProperties_card,
  PlayerProperties_player,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
`;
const PlayerImage = styled.div`
  width: 40%;
  max-width: 200px;
  min-width: 110px;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TeamImage = styled.img`
  height: 14px;
`;

type Props = {
  player: PlayerProperties_player;
  pictureUrl?: string | null;
  card?: PlayerProperties_card;
  showCardBonusIndicator?: boolean;
};
const PlayerProperties = ({
  player,
  pictureUrl,
  card,
  showCardBonusIndicator = true,
}: Props) => {
  const { displayName, age, position, lastFifteenSo5AverageScore } = player;

  const { name: clubName, pictureUrl: clubPictureUrl } =
    player?.activeClub || {};
  const { name: nationalTeamName, pictureUrl: nationalPictureUrl } =
    player?.activeNationalTeam || {};

  return (
    <Root>
      <PlayerImage>
        <GlareEffect pictureUrl={pictureUrl || ''} />
      </PlayerImage>
      <FlexContainer>
        <AverageScore
          score={lastFifteenSo5AverageScore}
          withTooltip
          scoreMode="AVERAGE_LAST_15_GAMES"
          size="small"
        />
        {card && (
          <CardBonus card={card} showBonus={showCardBonusIndicator} large />
        )}
      </FlexContainer>
      <FlexContainer>
        <Text20>
          <strong>{displayName}</strong>
        </Text20>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage {...positionShortNames[position]} />
        </Text16>
      </FlexContainer>
      <FlexColContainer>
        {[
          { name: clubName, image: clubPictureUrl },
          { name: nationalTeamName, image: nationalPictureUrl },
        ]
          .filter(Boolean)
          .map(
            field =>
              field.name && (
                <Fragment key={field.name}>
                  <FlexContainer>
                    <TeamImage src={field.image || ''} alt="" />
                    <Text16 color="var(--c-neutral-600)">{field.name}</Text16>
                  </FlexContainer>
                </Fragment>
              )
          )}
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="PlayerDetailsDialog.PlayerAge"
            defaultMessage="{age} years old"
            values={{ age }}
          />
        </Text16>
      </FlexColContainer>
    </Root>
  );
};

PlayerProperties.fragments = {
  player: gql`
    fragment PlayerProperties_player on Player {
      slug
      displayName
      age
      position: positionTyped
      lastFifteenSo5AverageScore: averageScore(
        type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
      )
      activeClub {
        slug
        name
        pictureUrl
      }
      activeNationalTeam {
        slug
        name
        pictureUrl
      }
    }
  `,
  card: gql`
    fragment PlayerProperties_card on Card {
      assetId
      slug
      ...CardBonus_WithEngine_card
    }
    ${CardBonus.fragments.cardWithEngine}
  `,
};

export default PlayerProperties;
