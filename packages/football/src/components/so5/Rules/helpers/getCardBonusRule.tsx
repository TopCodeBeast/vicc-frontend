import { TypedDocumentNode, gql } from '@apollo/client';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { withFragments } from '@sorare/core/src/gql';

import { FormatRule } from '@football/components/so5/Rules/types';

import { getCardBonusRule_vicc5Leaderboard } from './__generated__/getCardBonusRule.graphql';

const IconWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const Icon = styled.div`
  position: absolute;
  bottom: -8px;
  right: -6px;
`;

const messages = defineMessages({
  title: {
    id: 'Rules.getCardBonusRule.title',
    defaultMessage: 'Card Bonus',
  },
  defaultMessage: {
    id: 'Rules.getCardBonusRule.defaultMessage',
    defaultMessage: 'Season bonus, XP bonus and Collection bonus do not apply',
  },
});

const getCardBonusRule = withFragments(
  (vicc5Leaderboard: getCardBonusRule_vicc5Leaderboard): FormatRule[] => {
    const { engineConfiguration, mainRarityType } = vicc5Leaderboard;
    const { grade, collection, season } = engineConfiguration;

    if (grade || collection || season) {
      return [];
    }

    return [
      {
        id: 'cardBonus',
        label: <FormattedMessage {...messages.defaultMessage} />,
        defaultMessage: messages.defaultMessage,
        title: messages.title,
        icon: mainRarityType ? (
          <IconWrapper>
            <ScarcityIcon size="lg" scarcity={mainRarityType} />
            <Icon>
              <FontAwesomeIcon icon={faXmark} color="var(--c-red-600)" />
            </Icon>
          </IconWrapper>
        ) : null,
      } as any, //TODO
    ];
  },
  {
    vicc5Leaderboard: gql`
      fragment getCardBonusRule_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        mainRarityType
        engineConfiguration {
          grade
          collection
          season
        }
      }
    ` as TypedDocumentNode<getCardBonusRule_vicc5Leaderboard>,
  }
);

export default getCardBonusRule;
