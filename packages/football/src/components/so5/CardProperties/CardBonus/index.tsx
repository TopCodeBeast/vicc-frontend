import { TypedDocumentNode, gql } from '@apollo/client';
import { faDown, faUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Big from 'bignumber.js';
import classnames from 'classnames';
import { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { format } from '@sorare/core/src/lib/seasons';

import Item from '@football/components/so5/CardProperties/Item';

import {
  CardBonus_WithEngine_card,
  CardBonus_card,
} from './__generated__/index.graphql';
import { useCardBonus } from './useCardBonus';
import useRenderValue from './useRenderValue';

type Props = {
  card: CardBonus_card;
  large?: boolean;
  bonusOverride?: number;
  withTransferMalus?: boolean;
  engineConfiguration?: { captain?: number | null };
  captain?: boolean;
  showBonus?: boolean;
  outlined?: boolean;
};

const messages = defineMessages({
  captain: {
    id: 'CardBonus.captain',
    defaultMessage: 'Captain bonus',
  },
  levelBonus: {
    id: 'CardBonus.levelBonus',
    defaultMessage: 'Lvl {level} bonus',
  },
  scarcity: {
    id: 'CardBonus.scarcity',
    defaultMessage: 'Scarcity bonus',
  },
  transferMalus: {
    id: 'CardBonus.transferMalus',
    defaultMessage: 'Non transferrable XP',
  },
  collection: {
    id: 'CardBonus.collection',
    defaultMessage: 'Collection bonus',
  },
});

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--c-neutral-400);
  gap: 10px;
`;
const Key = styled(Caption)`
  margin-right: 5px;
  font-weight: var(--t-bold);
  color: var(--c-neutral-600);
`;
const Value = styled.div`
  font-size: 12px;
  line-height: 18px;
  text-transform: none;
  letter-spacing: normal;
  color: var(--c-neutral-1000);
  padding: 1px 8px;
  border-radius: 8px;
  font-weight: 700;
  &.positive {
    background-color: var(--c-green-600);
  }
  &.negative {
    background-color: var(--c-red-600);
  }
`;
const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const Bonus = styled(FontAwesomeIcon)`
  color: var(--c-green-600);
  margin-left: 4px;
  font-size: 14px;
`;
const Malus = styled(FontAwesomeIcon)`
  color: var(--c-red-600);
  margin-left: 4px;
  font-size: 14px;
`;

export const CardBonus = (props: Props) => {
  const {
    card,
    large,
    bonusOverride,
    withTransferMalus,
    captain,
    engineConfiguration,
    showBonus,
    outlined,
  } = props;
  const { formatMessage } = useIntlContext();

  const { powerBreakdown, season, powerMalusAfterTransfer, grade } = card;
  const renderValue = useRenderValue();
  const isCaptain = captain === true;
  const captainBonus = isCaptain ? engineConfiguration?.captain : null;
  const isCaptainPenalized = new Big(captainBonus || 0).lt(0);
  const cardBonus = useCardBonus(card, {
    captainBonus,
    bonusOverride,
    withTransferMalus,
    powerBreakdown,
  });

  const isPenalized = useMemo(() => {
    const { __typename, ...bonuses } = powerBreakdown;
    return (
      Object.values(bonuses).some(value => new Big(value).lt(0)) ||
      isCaptainPenalized
    );
  }, [powerBreakdown, isCaptainPenalized]);

  const renderRow = (key: string, value: string) => {
    const val = new Big(value);
    return (
      <Row>
        <Key>{key}</Key>
        <Value
          className={classnames({
            positive: val.gt(0),
            negative: val.lt(0),
          })}
        >
          {renderValue(val)}%
        </Value>
      </Row>
    );
  };
  return (
    <Item
      large={large}
      outlined={outlined}
      title={
        typeof bonusOverride === 'number' ||
        new Big(cardBonus).eq('0') ? undefined : (
          <TooltipContainer>
            {!new Big(powerBreakdown.season).eq(0) &&
              renderRow(format(season), powerBreakdown.season)}
            {!new Big(powerBreakdown.xp).eq(0) &&
              renderRow(
                formatMessage(messages.levelBonus, { level: grade }),
                powerBreakdown.xp
              )}
            {!new Big(powerBreakdown.scarcity).eq(0) &&
              renderRow(
                formatMessage(messages.scarcity),
                powerBreakdown.scarcity
              )}
            {withTransferMalus &&
              renderRow(
                formatMessage(messages.transferMalus),
                powerMalusAfterTransfer
              )}
            {isCaptain &&
              renderRow(
                formatMessage(messages.captain),
                (engineConfiguration?.captain || 0).toString()
              )}
            {!withTransferMalus &&
              !new Big(powerBreakdown.collection).eq(0) &&
              renderRow(
                formatMessage(messages.collection),
                (powerBreakdown?.collection || 0).toString()
              )}
          </TooltipContainer>
        )
      }
      value={
        <>
          {cardBonus}%
          {(showBonus || (isCaptain && !isCaptainPenalized)) && (
            <Bonus icon={faUp} />
          )}
          {isPenalized && (!isCaptain || isCaptainPenalized) && (
            <Malus icon={faDown} />
          )}
        </>
      }
    />
  );
};

CardBonus.fragments = {
  card: gql`
    fragment CardBonus_card on Card {
      slug
      assetId
      rarity
      power
      powerMalusAfterTransfer
      grade
      season {
        startYear
      }
      powerBreakdown {
        season
        xp
        scarcity
        collection
      }
    }
  ` as TypedDocumentNode<CardBonus_card>,
  cardWithEngine: gql`
    fragment CardBonus_WithEngine_card on Card {
      slug
      assetId
      rarity
      power(so5LeaderboardSlug: $so5LeaderboardSlug)
      powerMalusAfterTransfer
      grade
      season {
        startYear
      }
      powerBreakdown(so5LeaderboardSlug: $so5LeaderboardSlug) {
        season
        xp
        scarcity
        collection
      }
    }
  ` as TypedDocumentNode<CardBonus_WithEngine_card>,
};

export default CardBonus;
