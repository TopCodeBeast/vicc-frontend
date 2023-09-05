import { TypedDocumentNode, gql } from '@apollo/client';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { MouseEvent, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Text16 } from '@sorare/core/src/atoms/typography';

import Context from '@football/components/so5/ComposeTeam/Context';
import { ContextProvider_vicc5Lineup } from '@football/components/so5/ComposeTeam/ContextProvider/__generated__/index.graphql';
import BenchCard from '@football/components/so5/ComposeTeam/responsive/BenchCard';

import { PlayerGameScores } from './PlayerGameScores';
import PlayerStatusWarning from './PlayerStatusWarning';
import { BenchCardRow_card } from './__generated__/index.graphql';

type ContextProvider_vicc5Lineup_vicc5Appearances_card =
  ContextProvider_vicc5Lineup['vicc5Appearances'][number]['card'];

type Props = {
  card: BenchCardRow_card | ContextProvider_vicc5Lineup_vicc5Appearances_card;
  onSelect?: () => void;
  statsView: boolean;
  selectedCard?: boolean;
  highlighted?: boolean;
  showBonus?: boolean;
};

const Root = styled.div`
  outline: 2px solid transparent;
  overflow: hidden;
  border-radius: var(--double-unit);
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--c-neutral-200);
  cursor: pointer;
  &.selectedCard {
    outline: 2px solid var(--c-brand-600);
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-brand-600), 0.2),
        rgba(var(--c-rgb-brand-600), 0.2)
      ),
      var(--c-neutral-300);
  }
  &.highlighted:not(.selectedCard) {
    outline: 2px solid var(--c-neutral-500);
    background: var(--c-neutral-300);
  }
  &.selectedCard.highlighted {
    opacity: 0.9;
  }
  &:hover {
    box-shadow: var(--shadow-200);
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: inherit;
  &.usedCard {
    background: repeating-linear-gradient(
      -45deg,
      var(--c-neutral-200),
      var(--c-neutral-200) 10px,
      rgba(var(--c-rgb-neutral-400), 0.4) 10px,
      rgba(var(--c-rgb-neutral-400), 0.4) 11px
    );
  }
  padding: var(--intermediate-unit);
`;
const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--c-neutral-1000);
`;
const Buttons = styled.div`
  display: flex;
`;
const Clear = styled(IconButton)`
  font-size: 12px;
`;
const Details = styled(IconButton)`
  width: 40px;
  height: 40px;
`;

const BenchCardRow = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    card,
    highlighted,
    onSelect = () => {},
    statsView,
    selectedCard,
    showBonus,
  } = props;
  const { activePosition } = useContext(Context)!;

  const {
    removeCard,
    playerDetails,
    isDrawerOpen,
    setPlayerDetails,
    setIsDrawerOpen,
  } = useContext(Context)!;
  const handleSelect = (event: MouseEvent) => {
    event.stopPropagation();
    onSelect();
  };
  const clearCard = () => {
    removeCard(activePosition);
    setIsDrawerOpen(false);
  };
  const togglePlayerDetails = (event: MouseEvent) => {
    event.stopPropagation();
    if (playerDetails?.slug === card.player.slug && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setPlayerDetails({
        slug: card.player.slug,
        pictureUrl: card.pictureUrl,
        card,
      });
      setIsDrawerOpen(true);
    }
  };
  useEffect(() => {
    if (highlighted) {
      ref?.current?.focus();
    }
  }, [highlighted]);

  return (
    <Root
      className={classnames({ selectedCard, highlighted })}
      ref={ref}
      onClick={handleSelect}
      onKeyDown={e => {
        if (e.code === 'Enter') {
          if (selectedCard) {
            clearCard();
          } else {
            onSelect();
          }
        }
      }}
      role="button"
      tabIndex={0}
    >
      <Row>
        <BenchCard card={card} showBonus={showBonus} />
        <Right>
          <Buttons>
            {selectedCard && (
              <Clear color="transparent" type="button" onClick={clearCard}>
                <FontAwesomeIcon icon={faTimes} />
              </Clear>
            )}
            <Details color="transparent" onClick={togglePlayerDetails}>
              <Text16>
                <FontAwesomeIcon icon={faCircleInfo} color="white" />
              </Text16>
            </Details>
          </Buttons>
        </Right>
      </Row>
      {statsView &&
        Object.prototype.hasOwnProperty.call(card, 'playerWithStats') && (
          <PlayerGameScores
            player={(card as BenchCardRow_card).playerWithStats}
          />
        )}
      <PlayerStatusWarning card={card} />
    </Root>
  );
};

// playerWithStats alias exists because of a bug in graphql types gen
// which causes BenchCardRow_card_player type not to be generated correctly
// with @include and another player field in BenchCard_card
BenchCardRow.fragments = {
  card: gql`
    fragment BenchCardRow_card on Card {
      slug
      assetId
      playerWithStats: player @include(if: $statsView) {
        slug
        ...PlayerGameScores_player
      }

      ...BenchCard_card
      ...PlayerStatusWarning_card
    }
    ${BenchCard.fragments.card}
    ${PlayerGameScores.fragments.player}
    ${PlayerStatusWarning.fragments.card}
  ` as TypedDocumentNode<BenchCardRow_card>,
};

export default BenchCardRow;
