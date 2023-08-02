import { TypedDocumentNode } from '@apollo/client';
import { gql } from '@apollo/client/core';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { MouseEventHandler } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { LinkBox, LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import BudgetCost from '@football/components/draft/BudgetCost';
import PlayerCurrentUnavailabilityBadge from '@football/components/player/PlayerCurrentUnavailabilityBadge';
import InlineGame from '@football/components/stats/InlineGame';

import { DraftCard_draftablePlayer } from './__generated__/index.graphql';

const Article = styled(LinkBox).attrs({ as: 'article' })`
  isolation: isolate;
  display: grid;
  column-gap: var(--double-unit);
  grid-template-areas: 'card infos cta';
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  padding: var(--intermediate-unit);
  border-radius: var(--intermediate-unit);
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  cursor: pointer;
  &.selected,
  &.highlighted {
    background-color: rgba(var(--c-rgb-neutral-300), 0.85);
  }
  &.selected {
    /* fake outline as border-radius+outline doesn't work on safari */
    &::before {
      position: absolute;
      inset: -1px;
      border: 2px solid var(--c-brand-600);
      border-radius: var(--intermediate-unit);
      content: '';

      @media ${tabletAndAbove} {
        border-radius: var(--triple-unit);
      }
    }
  }
  @media ${tabletAndAbove} {
    background-color: unset;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--intermediate-unit);
    padding: var(--double-unit);
    border-radius: var(--triple-unit);
    &:hover:not(.selected),
    &:focus-within:not(.selected) {
      background-color: var(--c-neutral-200);
    }
  }
`;

const Cta = styled.div`
  grid-area: cta;
  button {
    margin: 0;
  }
  @media ${tabletAndAbove} {
    margin-top: auto;
  }
`;
const SelectButton = styled(Button).attrs({
  small: true,
  fullWidth: true,
  disableDebounce: true,
})``;
const ImgWrapper = styled.div`
  position: relative;
  grid-area: card;
`;
const Infos = styled.div`
  grid-area: infos;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  @media ${tabletAndAbove} {
    gap: var(--half-unit);
  }
`;
const InjuryWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const CostAndInjuryWrapper = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Card = ({
  draftablePlayer,
  selected,
  loading,
  remove,
  add,
  togglePlayerDetails,
  highlighted,
}: {
  draftablePlayer: DraftCard_draftablePlayer;
  selected?: boolean;
  loading?: boolean;
  remove: (id: string) => void;
  add: (player: DraftCard_draftablePlayer) => void;
  togglePlayerDetails: MouseEventHandler;
  highlighted?: boolean;
}) => {
  const { up: isTablet } = useScreenSize('tablet');

  const {
    nextGame: upcomingGame,
    player,
    id,
    value,
    pictureUrl,
    team,
  } = draftablePlayer;
  const { displayName } = player;
  const getButtonColor = () => {
    if (selected) {
      return 'red';
    }
    if (highlighted) {
      return 'blue';
    }
    return 'white';
  };
  const onSelect: MouseEventHandler = e => {
    e.stopPropagation();
    if (selected) {
      remove(id);
    } else {
      add(draftablePlayer);
    }
  };
  return (
    <Article
      key={id}
      className={classnames({ selected, highlighted })}
      onClick={isTablet && !highlighted ? togglePlayerDetails : onSelect}
    >
      <ImgWrapper>
        <CardImg
          src={pictureUrl}
          alt=""
          loading="lazy"
          width={isTablet ? 320 : 80}
        />
      </ImgWrapper>
      <Infos>
        <CostAndInjuryWrapper>
          <BudgetCost value={value} />
          <InjuryWrapper>
            <PlayerCurrentUnavailabilityBadge player={player} />
          </InjuryWrapper>
        </CostAndInjuryWrapper>
        <Text14>{displayName}</Text14>
        <InlineGame game={upcomingGame} team={team} />
      </Infos>
      <Cta>
        {isTablet ? (
          <LinkOther
            as={SelectButton}
            color={getButtonColor()}
            disabled={loading}
            onClick={onSelect}
            type="button"
          >
            {selected && <FormattedMessage {...glossary.remove} />}
            {!selected && (
              <FormattedMessage
                id="Draft.PlayerList.Cta.Select"
                defaultMessage="Select"
              />
            )}
          </LinkOther>
        ) : (
          <LinkOther as={IconButton} onClick={togglePlayerDetails}>
            <Text16>
              <FontAwesomeIcon icon={faCircleInfo} color="white" />
            </Text16>
          </LinkOther>
        )}
      </Cta>
    </Article>
  );
};

export default Card;

Card.fragments = {
  draftablePlayer: gql`
    fragment DraftCard_draftablePlayer on DraftablePlayer {
      id
      value
      pictureUrl
      nextGame {
        id
        ...InlineGame_game
      }
      player {
        slug
        displayName
        ...PlayerCurrentUnavailabilityBadge_player
      }
      team {
        ... on TeamInterface {
          slug
          id
          name
        }
      }
    }
    ${PlayerCurrentUnavailabilityBadge.fragments.player}
    ${InlineGame.fragments.game}
  ` as TypedDocumentNode<DraftCard_draftablePlayer>,
};
