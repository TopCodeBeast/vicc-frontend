import { gql } from '@apollo/client';
import { memo, useCallback, useContext } from 'react';
import styled from 'styled-components';

import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { Scarcity } from '@sorare/core/src/lib/cards';

import Context from '@football/components/so5/ComposeTeam/Context';
import CaptainToggle from '@football/components/so5/ComposeTeam/responsive/CaptainToggle';
import ProLayer from '@football/components/so5/ComposeTeam/responsive/ProLayer';
import { EditableAppearance, Position } from '@football/lib/so5';

import { LineupCard_so5Appearance } from './__generated__/index.graphql';

type LineupCard_so5Appearance_card = LineupCard_so5Appearance['card'];

const Captain = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-40%, -40%);
  z-index: 2;
`;

const Button = styled.button`
  display: block;
  width: 100%;
`;

interface Props {
  item: EditableAppearance<LineupCard_so5Appearance_card>;
  active: boolean;
  onSelect: () => void;
  position: Position;
}

const LineupCard = (props: Props) => {
  const { item, onSelect, position } = props;
  const {
    lineupComplete,
    captain,
    toggleCaptain,
    statsView,
    captainRarities,
    needCaptain,
  } = useContext(Context)!;

  const handleToggleCaptain = useCallback(
    () => toggleCaptain(position),
    [position, toggleCaptain]
  );

  const captainActive = captain?.card?.slug === item?.card?.slug;
  const captainVisible = lineupComplete && needCaptain;
  const disableCaptainAnimation = !!captain;

  return (
    item.card && (
      <div>
        {captainRarities.includes(item.card?.rarity as Scarcity) &&
          captainVisible && (
            <Captain>
              <CaptainToggle
                disablePositioning
                onClick={handleToggleCaptain}
                active={captainActive}
                disableAnimation={disableCaptainAnimation}
              />
            </Captain>
          )}
        <Button type="button" onClick={onSelect}>
          {statsView && <ProLayer card={item.card} />}
          <CardImg src={item.card.pictureUrl ?? undefined} width={160} alt="" />
        </Button>
      </div>
    )
  );
};

const Memoized = memo(LineupCard);

const cardFragment = gql`
  fragment LineupCard_card on Card {
    slug
    assetId
    rarity
    pictureUrl: pictureUrl(derivative: "tinified")
    player {
      slug
      displayName
    }
    ...ProLayer_card
  }
  ${ProLayer.fragments.card}
`;

Memoized.fragments = {
  card: cardFragment,
  so5_appearance: gql`
    fragment LineupCard_so5Appearance on Vicc5Appearance {
      card {
        slug
        assetId
        ...LineupCard_card
      }
    }
    ${cardFragment}
  `,
};

export default Memoized;
