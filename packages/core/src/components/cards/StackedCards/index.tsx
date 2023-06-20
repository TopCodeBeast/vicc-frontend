import styled from 'styled-components';

import { ValidWidths } from '@sorare/core/src/atoms/ui/ResponsiveImg';
import UninteractiveToken from 'components/token/UninteractiveToken';

const ImagesContainer = styled.div`
  position: relative;
  isolation: isolate;

  > * {
    transition: transform 0.2s ease-in-out;
    max-width: 100%;
    border-radius: 10px;

    &:first-child {
      transform: scale(0.96);
      transform-origin: center top;
    }
    &:not(:first-child) {
      position: absolute;
      z-index: -1;
      inset: 0;
      transform-origin: center bottom;
    }
    /* first child when only 2 cards */
    &:first-child:nth-last-child(2) {
      transform: scale(0.98);
    }
    &:nth-child(2) {
      transform: scale(0.84);
      filter: brightness(60%);
    }
    /* last child when only 2 cards */
    &:last-child:nth-child(2) {
      transform: scale(0.9);
      filter: brightness(80%);
    }
    &:nth-child(3) {
      transform: translateY(-2%) scale(0.9);
      filter: brightness(80%);
    }
  }

  :hover {
    > *:first-child {
      transform: translateY(calc(-1 * var(--half-unit))) scale(0.96);
    }
    /* first child when only 2 cards */
    > *:first-child:nth-last-child(2) {
      transform: translateY(calc(-1 * var(--half-unit))) scale(0.98);
    }
    > *:nth-child(3) {
      transform: translateY(calc(-2% - 2px)) scale(0.9);
    }
  }
`;

const StackedCards = ({
  src,
  alt,
  count,
  width = 320,
}: {
  src: string;
  alt: string;
  count: number;
  width?: ValidWidths;
}) => {
  const token = {
    pictureUrl: src,
    slug: alt,
  };
  return (
    <ImagesContainer>
      <UninteractiveToken width={width} token={token} />
      {count > 1 && <UninteractiveToken width={width} token={token} />}
      {count > 2 && <UninteractiveToken width={width} token={token} />}
    </ImagesContainer>
  );
};

export default StackedCards;
