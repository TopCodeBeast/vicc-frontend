import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import { MultiCardsSpinner } from '@sorare/core/src/atoms/animations/MultiCardsSpinner';
import { CardImg } from '@sorare/core/src/components/card/CardImg';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

const spinnerCardsData = [
  {
    cardUrl:
      'https://assets.sorare.com/card/8160fe48-3dec-4517-bdb9-4112fec372a7/picture/tinified-5c41482618abf17db3f31409a7acef3a.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/unique.svg`,
    label: <FormattedMessage {...scarcityMessages.unique} />,
  },
  {
    cardUrl:
      'https://assets.sorare.com/card/d22347db-8e61-4e9e-9e78-8cd4d5eed882/picture/tinified-314121dfe1d9fef1bd18c10cc5e2b274.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/super_rare.svg`,
    label: <FormattedMessage {...scarcityMessages.super_rare} />,
  },
  {
    cardUrl:
      'https://assets.sorare.com/card/69f8a417-f2b4-4443-b9f6-a1f2e0314ca3/picture/tinified-1e5da74b8a48ae162aee35549143de9f.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/rare.svg`,
    label: <FormattedMessage {...scarcityMessages.rare} />,
  },
  {
    cardUrl:
      'https://assets.sorare.com/card/92430d85-a745-4b80-bfd4-a63c7e1797dd/picture/tinified-59bb11ce5a1f0cd4c46a2010e0516c40.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/limited.svg`,
    label: <FormattedMessage {...scarcityMessages.limited} />,
  },
  {
    cardUrl:
      'https://assets.sorare.com/card/d22347db-8e61-4e9e-9e78-8cd4d5eed882/picture/tinified-314121dfe1d9fef1bd18c10cc5e2b274.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/super_rare.svg`,
    label: <FormattedMessage {...scarcityMessages.super_rare} />,
  },
  {
    cardUrl:
      'https://assets.sorare.com/card/69f8a417-f2b4-4443-b9f6-a1f2e0314ca3/picture/tinified-1e5da74b8a48ae162aee35549143de9f.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/rare.svg`,
    label: <FormattedMessage {...scarcityMessages.rare} />,
  },
  {
    cardUrl:
      'https://assets.sorare.com/card/92430d85-a745-4b80-bfd4-a63c7e1797dd/picture/tinified-59bb11ce5a1f0cd4c46a2010e0516c40.png',
    cardBackUrl: `${FRONTEND_ASSET_HOST}/cards/back/limited.svg`,
    label: <FormattedMessage {...scarcityMessages.limited} />,
  },
];

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
  gap: var(--double-unit);
  transform: translate3d(0, 0, 0);
  width: var(--imageWidth);
`;

const card = css`
  aspect-ratio: var(--card-aspect-ratio);
  max-width: 100%;
  backface-visibility: hidden;
`;

const StyledBack = styled.img`
  ${card}
  position: absolute;
  transform: rotateY(180deg);
`;

const StyledCardImg = styled(CardImg)`
  ${card}
`;

const ScarcityText = styled.span`
  font-weight: var(--t-bold);
  font-size: 28px;
  backface-visibility: hidden;
  text-align: center;
`;

type Props = {
  imageWidth?: number;
  withScarcityText?: boolean;
  nbCards?: number;
};
export const ScarceCardsSpinner = ({
  imageWidth = 160,
  withScarcityText = true,
  nbCards = 7,
}: Props) => {
  const displayedCardsData = spinnerCardsData.slice(0, nbCards);

  return (
    <MultiCardsSpinner noRandomness itemWidth={imageWidth}>
      {displayedCardsData.map(({ cardUrl, cardBackUrl, label }, index) => (
        <CardWrapper
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={{ '--imageWidth': `${imageWidth}px` } as CSSProperties}
        >
          <StyledBack src={cardBackUrl} />
          <StyledCardImg width={160} src={cardUrl} alt="" />
          {withScarcityText && <ScarcityText>{label}</ScarcityText>}
        </CardWrapper>
      ))}
    </MultiCardsSpinner>
  );
};
