import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { ComponentType, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Skeleton } from '@sorare/core/src/atoms/animations/Skeleton';
import { Props as ButtonProps } from '@sorare/core/src/atoms/buttons/Button';
import DotsLoader from '@sorare/core/src/atoms/loader/DotsLoader';
import { Text16, Text20 } from '@sorare/core/src/atoms/typography';
import { cardsPreviewContainerStyle } from '@sorare/core/src/components/bundled/CardsPreviewContainer';
import { LEGACY_BUNDLE_PAGE } from '@sorare/core/src/constants/routes';
import { fragments as analyticsFragments } from '@sorare/core/src/contexts/events/types';
import ErrorBoundary from '@sorare/core/src/contexts/sentry/ErrorBoundary';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { range } from '@sorare/core/src/lib/arrays';
import { cardRatio } from '@sorare/core/src/lib/cardPicture';
import { Link } from '@sorare/core/src/routing/Link';

import AuctionTimeLeft from '@marketplace/components/auction/AuctionTimeLeft';
import PrimaryOfferBuyField from '@marketplace/components/primaryOffer/PrimaryOfferBuyField';
import { PrimaryOfferTokensPreview } from '@marketplace/components/primaryOffer/PrimaryOfferTokensPreview';
import SmallUser from '@marketplace/components/user/SmallUser';

import { PrimaryOfferPreview_primaryOffer } from './__generated__/index.graphql';

interface Props {
  primaryOffer: PrimaryOfferPreview_primaryOffer;
  bundlePrediction?: ReactNode;
  buyButtonProps?: ButtonProps;
  CustomPreview?: ComponentType<{
    to: string;
    assetIds: string[];
  }> | null;
}

const CardsPreview = styled(Link)`
  padding: var(--double-unit);
  ${cardsPreviewContainerStyle}
`;

const Price = styled(Text20)`
  color: var(--c-neutral-1000);
  font-weight: bold;
`;

const Date = styled.div`
  font: var(--t-12);
  color: var(--c-neutral-600);
`;

const Line = styled.div`
  padding: var(--intermediate-unit) var(--double-unit);
  border-top: var(--c-neutral-300) solid 1px;
`;

const Footer = styled.div`
  padding: var(--intermediate-unit) var(--double-unit);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: var(--c-neutral-300) solid 1px;
`;

const ImgSkeleton = styled(Skeleton)`
  aspect-ratio: ${cardRatio};
`;

export const LoadingPrimaryOfferPreview = () => {
  return (
    <>
      <CardsPreview as="div">
        {range(5).map(i => (
          // eslint-disable-next-line react/no-array-index-key
          <ImgSkeleton key={i} />
        ))}
      </CardsPreview>
      <Text16>&nbsp;</Text16>
      <Footer />
    </>
  );
};

const PriceAndTime = ({
  price,
  endDate,
}: {
  price: string;
  endDate: string;
}) => {
  const ended = isPast(parseISO(endDate));
  if (ended) return <DotsLoader />;
  return (
    <>
      <Price>{price}</Price>
      <Date>
        <AuctionTimeLeft endDate={endDate} />
      </Date>
    </>
  );
};

export const PrimaryOfferPreview = ({
  primaryOffer,
  bundlePrediction,
  CustomPreview,
  buyButtonProps = {},
}: Props) => {
  const { nfts, priceWei, priceFiat, endDate, buyer, id } = primaryOffer;
  const {
    flags: { useSportWithUncoloredCta = [] },
  } = useFeatureFlags();
  const ended = isPast(parseISO(endDate));
  const location = useLocation();
  const bought = !!buyer;
  const { generateSportPath } = useSportContext();
  const sport = nfts?.[0].sport;
  const { main: price } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency: SupportedCurrency.WEI,
      wei: priceWei,
      ...priceFiat,
    },
  });

  const dest = generateSportPath(LEGACY_BUNDLE_PAGE + location.search, {
    params: { id: idFromObject(id) },
    sport,
  });

  const buttonColor = () => {
    if (ended) return 'darkGray';
    return useSportWithUncoloredCta.includes(sport) ? 'mediumGray' : 'blue';
  };

  return (
    <ErrorBoundary>
      {CustomPreview ? (
        <CustomPreview to={dest} assetIds={nfts.map(nft => nft.assetId)} />
      ) : (
        <CardsPreview to={dest}>
          <PrimaryOfferTokensPreview nfts={nfts} />
        </CardsPreview>
      )}
      {bundlePrediction && (
        <Line>
          <Text16>{bundlePrediction}</Text16>
        </Line>
      )}
      <Footer>
        <div>
          {bought ? (
            <SmallUser user={buyer} />
          ) : (
            <PriceAndTime endDate={endDate} price={price} />
          )}
        </div>
        {!bought && (
          <PrimaryOfferBuyField
            disabled={ended}
            color={buttonColor()}
            primaryOffer={primaryOffer}
            medium
            {...buyButtonProps}
          />
        )}
      </Footer>
    </ErrorBoundary>
  );
};

PrimaryOfferPreview.fragments = {
  primaryOffer: gql`
    fragment PrimaryOfferPreview_primaryOffer on TokenPrimaryOffer {
      id
      endDate
      buyer {
        slug
        ...SmallUser_user
      }
      priceWei
      priceFiat {
        eur
        usd
        gbp
      }
      nfts {
        assetId
        slug
        sport
        ...Analytics_tokenInfo
        ...PrimaryOfferTokensPreview_token
      }
      ...PrimaryOfferBuyField_primaryOffer
    }
    ${SmallUser.fragments.user}
    ${PrimaryOfferBuyField.fragments.primaryOffer}
    ${analyticsFragments.tokenInfo}
    ${PrimaryOfferTokensPreview.fragments.token}
  `,
};

export default PrimaryOfferPreview;
