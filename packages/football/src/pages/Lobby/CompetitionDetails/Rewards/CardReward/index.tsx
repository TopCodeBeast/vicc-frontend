import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo } from 'react';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { REWARDS } from '@sorare/core/src/constants/routes';
import { formatScarcity } from '@sorare/core/src/lib/cards';
import { qualityNames } from '@sorare/core/src/lib/players';

import {
  ActionableRewardRow,
  RewardRow,
} from '@football/pages/Lobby/CompetitionDetails/Rewards/RewardRow';

import { CardReward_so5RewardCardConfig } from './__generated__/index.graphql';

const CardDetails = styled(Text16)`
  display: flex;
  gap: var(--half-unit);
`;
const CardQuality = styled.span`
  background: linear-gradient(
    180deg,
    #fffefc 0%,
    #c3d4de 35.28%,
    #6dbdf1 53.51%,
    #a9dce5 81.64%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

type Props = {
  card: CardReward_so5RewardCardConfig;
  slug: string;
};
const CardReward = ({ card, slug }: Props) => {
  const { rarity, displayEdition, quality, quantity = 1 } = card;
  const displayRarity = formatScarcity(rarity, displayEdition);
  const displayQuality = !!quality && qualityNames[quality];

  const link = useMemo(() => {
    if (card.quality) {
      return generatePath(REWARDS, {
        so5LeagueSlug: slug,
        rarity: card.rarity,
        quality: card.quality.toLowerCase(),
      });
    }
    return null;
  }, [card, slug]);

  const RootContent = (
    <>
      <ScarcityIcon scarcity={card?.rarity} size="md" />
      <CardDetails>
        {quantity > 1 && <span>x{quantity}</span>}
        <span>{displayRarity}</span>
        {displayQuality && <CardQuality>{displayQuality}</CardQuality>}
        {rarity !== 'custom_series' && displayEdition && (
          <span>{displayEdition}</span>
        )}
      </CardDetails>
    </>
  );

  if (link) {
    return (
      <ActionableRewardRow as={Link} to={link}>
        {RootContent}
      </ActionableRewardRow>
    );
  }
  return <RewardRow>{RootContent}</RewardRow>;
};

CardReward.fragments = {
  So5RewardCardConfig: gql`
    fragment CardReward_so5RewardCardConfig on So5RewardCardConfig {
      quantity
      quality
      rarity
      displayEdition
    }
  ` as TypedDocumentNode<CardReward_so5RewardCardConfig>,
};

export default CardReward;
