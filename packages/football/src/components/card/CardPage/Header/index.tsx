import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import GlareEffect from '@sorare/core/src/atoms/animations/GlareEffect';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import CardProperties from '@football/components/so5/CardProperties';

import { CardPageHeader_card } from './__generated__/index.graphql';

interface Props {
  card: CardPageHeader_card;
  onClose?: () => void;
  inDialog?: boolean;
}

const Root = styled.div<{ inDialog?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: relative;

  @media ${laptopAndAbove} {
    height: auto;
    flex-grow: 1;
    position: sticky;
    top: ${({ inDialog }) =>
      inDialog
        ? `calc(5 * var(--unit))`
        : `calc(var(--navbar-height-desktop) + 5 * var(--unit))`};
  }
`;

const PictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
  position: relative;
  z-index: 0;
  max-width: calc(32 * var(--unit));
  filter: drop-shadow(0px 5px 10px rgb(0 0 0 / 40%));
`;

export const Header = ({ card, inDialog }: Props) => {
  return (
    <Root inDialog={inDialog}>
      <PictureContainer>
        <GlareEffect pictureUrl={card.pictureUrl} />
        <CardProperties card={card} />
      </PictureContainer>
    </Root>
  );
};

Header.fragments = {
  card: gql`
    fragment CardPageHeader_card on Card {
      slug
      assetId
      pictureUrl: pictureUrl(derivative: "tinified")
      ...CardProperties_card
    }
    ${CardProperties.fragments.card}
  ` as TypedDocumentNode<CardPageHeader_card>,
};

export default Header;
