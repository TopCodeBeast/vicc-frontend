import { gql } from '@apollo/client';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import {
  CommonDraftCampaignStatus,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import {
  FOOTBALL_DRAFT,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';

import { CardPlaceholder } from '@football/components/lineup/CardPlaceholder';
import { CardFooter } from '@football/components/lineup/PlayerCard';

import {
  PlayerCardPlaceholder_so5Leaderboard,
  PlayerCardPlaceholder_so5Lineup,
} from './__generated__/index.graphql';

const Wrapper = styled(LinkOther)`
  & > * {
    transition: transform 200ms ease-in-out;
  }
  &:hover,
  &:focus {
    & > * {
      transform: scale(1.05);
    }
  }
`;
type Props = {
  position: number;
  onUnlockCtaClick?: () => void;
  lineup?: PlayerCardPlaceholder_so5Lineup | null;
  leaderboard: PlayerCardPlaceholder_so5Leaderboard;
};

const CARD_DISPLAY_ORDER_BY_RARITY = [
  {
    id: 'common',
    rarity: Rarity.common,
  },
  {
    id: 'limited',
    rarity: Rarity.limited,
  },
  {
    id: 'rare',
    rarity: Rarity.rare,
  },
  {
    id: 'superRare',
    rarity: Rarity.super_rare,
  },
  {
    id: 'unique',
    rarity: Rarity.unique,
  },
] as const;

const getRarityInfo = (
  rarity: Rarity,
  rarityLimit: number,
  cardsCount: number
) => {
  return new Array(rarityLimit).fill(rarity).map((_, index) => ({
    rarity,
    available: rarity === Rarity.common || index < cardsCount,
  }));
};
const PlayerCardPlaceholder = ({ position, lineup, leaderboard }: Props) => {
  const locked = !leaderboard.canCompose.value;
  const rarityLimits = leaderboard.displayedRules?.rarityLimits;

  const { currentUser } = useCurrentUserContext();
  const displayedRarities = CARD_DISPLAY_ORDER_BY_RARITY.reduce(
    (acc, { id, rarity }) => {
      if (acc.length >= 5) {
        return acc;
      }
      if (rarityLimits?.[id]?.min && rarityLimits[id].min > 0) {
        return [
          ...acc,
          ...getRarityInfo(
            rarity,
            rarityLimits[id].min,
            id === 'common' ? 0 : currentUser?.cardCounts?.[id] || 0
          ),
        ];
      }
      if (rarityLimits?.[id]?.max && rarityLimits[id].max > 0) {
        return [...acc, ...new Array(rarityLimits[id].max).fill(rarity)];
      }
      return acc;
    },
    [] as { rarity: Rarity; available: boolean }[]
  );

  const { rarity = Rarity.common, available } =
    displayedRarities[position] || {};

  const getPlaceholderLink = () => {
    if (locked) {
      return undefined;
    }
    if (
      !lineup &&
      leaderboard.commonDraftCampaign?.status === CommonDraftCampaignStatus.OPEN
    ) {
      return generatePath(FOOTBALL_DRAFT, { slug: leaderboard.slug });
    }
    return getComposeTeamRoute({
      vicc5LeaderboardSlug: leaderboard.slug,
      vicc5LineupId: idFromObject(lineup?.id),
    });
  };

  const content = (
    <>
      <CardPlaceholder
        rarity={rarity}
        empty={!lineup}
        locked={locked}
        available={available}
      />
      <CardFooter />
    </>
  );
  return locked ? (
    <div>{content}</div>
  ) : (
    <Wrapper as={Link} to={getPlaceholderLink() || ''}>
      {content}
    </Wrapper>
  );
};

PlayerCardPlaceholder.fragments = {
  so5Lineup: gql`
    fragment PlayerCardPlaceholder_so5Lineup on Vicc5Lineup {
      id
    }
  `,
  so5Leaderboard: gql`
    fragment PlayerCardPlaceholder_so5Leaderboard on Vicc5Leaderboard {
      slug
      commonDraftCampaign {
        slug
        status
      }
      canCompose {
        value
      }
      displayedRules {
        id
        rarityLimits {
          common {
            min
            max
          }
          limited {
            min
            max
          }
          rare {
            min
            max
          }
          superRare {
            min
            max
          }
          unique {
            min
            max
          }
        }
      }
    }
  `,
};

export default PlayerCardPlaceholder;
