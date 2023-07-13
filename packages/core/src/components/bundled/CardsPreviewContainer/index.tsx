import styled, { css } from 'styled-components';

import { cardRatio } from '@core/lib/cardPicture';

export const cardsPreviewContainerStyle = css`
  width: 100%;
  display: grid;
  grid-column-gap: var(--unit);
  grid-template-columns: 1fr calc(25% - ${cardRatio} * var(--unit)) calc(
      25% - ${cardRatio} * var(--unit)
    );
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'main . .'
    'main . .';

  & > :nth-child(1) {
    grid-area: main;
  }

  & > :nth-child(4),
  > :nth-child(5) {
    align-self: end;
  }

  & > * {
    width: 100%;
  }
`;

const tinyCardsPreviewContainerStyle = css`
  width: 100%;
  display: grid;
  grid-column-gap: 2px;
  grid-template-columns: 1fr calc(25% - ${cardRatio} * 2px) calc(
      25% - ${cardRatio} * 2px
    );
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'main . .'
    'main . .';

  & > :nth-child(1) {
    grid-area: main;
  }

  & > :nth-child(4),
  > :nth-child(5) {
    align-self: end;
  }

  & > * {
    width: 100%;
  }
`;

const CardsPreviewContainer = styled.div`
  ${cardsPreviewContainerStyle}
`;

export const TinyCardsPreviewContainer = styled.div`
  ${tinyCardsPreviewContainerStyle}
`;

export default CardsPreviewContainer;
