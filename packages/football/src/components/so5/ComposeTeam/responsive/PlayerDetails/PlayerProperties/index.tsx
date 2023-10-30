import { TypedDocumentNode, gql } from '@apollo/client';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import { Text16, Text20 } from '@sorare/core/src/atoms/typography';

import BudgetCost from '@football/components/draft/BudgetCost';
import AverageScore from '@football/components/so5/AverageScore';
import CardBonus from '@football/components/so5/CardProperties/CardBonus';
import { positionShortNames } from '@football/lib/so5';

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
  budgetValue?: number;
};
const PlayerProperties = ({
  player,
  pictureUrl,
  card,
  showCardBonusIndicator = true,
  budgetValue,
}: Props) => {
  const { displayName, age, position, lastFifteenVicc5AverageScore } = player;

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
        {budgetValue ? (
          <BudgetCost value={budgetValue} />
        ) : (
          <>
            <AverageScore
              score={lastFifteenVicc5AverageScore}
              withTooltip
              scoreMode="AVERAGE_LAST_15_GAMES"
              size="small"
            />
            {card && (
              <CardBonus card={card} showBonus={showCardBonusIndicator} large />
            )}
          </>
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
      position
      lastFifteenVicc5AverageScore: averageScore(
        type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE
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
  ` as TypedDocumentNode<PlayerProperties_player>,
  card: gql`
    fragment PlayerProperties_card on Card {
      assetId
      slug
      ...CardBonus_WithEngine_card
    }
    ${CardBonus.fragments.cardWithEngine}
  ` as TypedDocumentNode<PlayerProperties_card>,
};

export default PlayerProperties;
