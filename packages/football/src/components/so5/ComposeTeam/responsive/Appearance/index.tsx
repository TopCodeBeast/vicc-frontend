import { TypedDocumentNode, gql } from '@apollo/client';
import { RefObject, memo, useCallback, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { AveragePlayerScore } from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import {
  CamelCaseScarcity,
  Scarcity,
  scarcityNames,
} from '@sorare/core/src/lib/cards';
import { toCamelCase } from '@sorare/core/src/lib/toCamelCase';

import AverageScore from '@football/components/so5/AverageScore';
import Context from '@football/components/so5/ComposeTeam/Context';
import AppearancePower from '@football/components/so5/ComposeTeam/responsive/AppearancePower';
import LineupCard from '@football/components/so5/ComposeTeam/responsive/LineupCard';
import { EditableAppearance, Position, hasBonuses } from '@football/lib/so5';

import { Appearance_so5Appearance } from './__generated__/index.graphql';

type Appearance_so5Appearance_card = Appearance_so5Appearance['card'];

const Wrapper = styled.div`
  position: relative;
`;
const ExtraInfo = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, var(--unit));
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  justify-content: center;
`;
const FlexContainer = styled.div`
  display: flex;
  gap: var(--half-unit);
`;
const Limit = styled(Text14)`
  color: var(--c-static-neutral-100);
  display: block;
  background: var(--c-red-600);
  border-radius: var(--double-unit);
  padding: 0 var(--unit);
  white-space: nowrap;
`;

type Props = {
  index: number;
  item: EditableAppearance<Appearance_so5Appearance_card>;
  position: Position;
  scrollTo?: (ref: RefObject<HTMLDivElement>) => void;
  onSelect?: () => void;
};

const Appearance = (props: Props) => {
  const { item, position, onSelect } = props;
  const {
    lineupRarities,
    rules,
    setActivePosition,
    activePosition,
    so5Leaderboard,
  } = useContext(Context)!;
  const { captain, displayedAverageScore, isCappedMode } = useContext(Context)!;

  const { card } = item;

  const active = position === activePosition;
  const isCaptain = captain === item;

  const handleSelect = useCallback(() => {
    setActivePosition(position);
    if (onSelect) {
      onSelect();
    }
  }, [onSelect, position, setActivePosition]);

  if (!card) {
    return null;
  }

  const count = lineupRarities[card.rarity as Scarcity];
  const limitExists = rules?.rarityLimits && card.rarity in rules.rarityLimits;
  const limit =
    rules?.rarityLimits?.[
      toCamelCase(card.rarity) as Exclude<CamelCaseScarcity, 'customSeries'>
    ].max;
  const limitReached = limitExists && count > limit!;

  return (
    <Wrapper>
      <LineupCard
        item={item}
        active={active}
        onSelect={handleSelect}
        position={position}
      />

      <ExtraInfo>
        <FlexContainer>
          <AverageScore
            capped={isCappedMode}
            score={
              card?.[
                displayedAverageScore ===
                AveragePlayerScore.LAST_FIVE_SO5_AVERAGE_SCORE
                  ? 'lastFiveSo5AverageScore'
                  : 'lastFifteenSo5AverageScore'
              ]
            }
            withTooltip
            size="smaller"
            scoreMode={
              displayedAverageScore ===
              AveragePlayerScore.LAST_FIVE_SO5_AVERAGE_SCORE
                ? 'AVERAGE_LAST_5_GAMES'
                : 'AVERAGE_LAST_15_GAMES'
            }
          />
          {(hasBonuses(so5Leaderboard) || isCaptain) && (
            <AppearancePower
              position={position}
              card={card}
              captain={isCaptain}
            />
          )}
        </FlexContainer>
        {limitReached && (
          <Limit bold>
            <FormattedMessage
              id="ComposeTeam.Appearance.max"
              defaultMessage="Max {limit} {rarity}"
              values={{
                limit,
                rarity: scarcityNames[card.rarity],
              }}
            />
          </Limit>
        )}
      </ExtraInfo>
    </Wrapper>
  );
};

const Memoized = memo(Appearance);

Memoized.fragments = {
  so5_appearance: gql`
    fragment Appearance_so5Appearance on So5Appearance {
      ...LineupCard_so5Appearance
      id
      captain
      card {
        assetId
        slug
        lastFiveSo5AverageScore: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE)
        lastFifteenSo5AverageScore: averageScore(
          type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
        )
        ...AppearancePower_card
      }
    }
    ${LineupCard.fragments.so5_appearance}
    ${AppearancePower.fragments.card}
  ` as TypedDocumentNode<Appearance_so5Appearance>,
};

export default Memoized;
