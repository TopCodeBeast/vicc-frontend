import { TypedDocumentNode, gql } from '@apollo/client';
import { faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { CamelCase } from '@sorare/core/src/types';

import {
  RuleRow,
  Props as RuleRowProps,
} from '@football/components/competition/CompetitionRules/RuleRow';

import { RarityLimitRuleRow_vicc5Leaderboard } from './__generated__/index.graphql';

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-yellow-800);
`;

export type Props = RuleRowProps & {
  vicc5Leaderboard: RarityLimitRuleRow_vicc5Leaderboard;
  rarity: CamelCase<Exclude<keyof typeof Rarity, 'custom_series'>>;
};

export const RarityLimitRuleRow = ({
  vicc5Leaderboard,
  rarity,
  ...otherProps
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const userHasNeededCards = () => {
    if (!currentUser || rarity === 'common') {
      return true;
    }
    const rarityLimits = vicc5Leaderboard.displayedRules?.rarityLimits?.[rarity];
    const neededCards =
      rarityLimits?.min === 0 && rarityLimits.max === 5
        ? rarityLimits.max
        : rarityLimits?.min;
    return currentUser.cardCounts[rarity] >= (neededCards || 0);
  };

  if (userHasNeededCards()) {
    return <RuleRow {...otherProps} />;
  }
  return (
    <RuleRow
      {...otherProps}
      requirement={
        <Requirement>
          {otherProps.requirement}
          <FontAwesomeIcon icon={faCircleExclamation} />
        </Requirement>
      }
    />
  );
};

RarityLimitRuleRow.fragments = {
  vicc5Leaderboard: gql`
    fragment RarityLimitRuleRow_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      displayedRules {
        id
        rarityLimits {
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
  ` as TypedDocumentNode<RarityLimitRuleRow_vicc5Leaderboard>,
};
