import { gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { Caption } from '@sorare/core/src/atoms/typography';
import Since from '@sorare/core/src/contexts/intl/Since';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';

import ItemEndDate from '@marketplace/components/ItemPreview/ItemEndDate';
import ItemPrice from '@marketplace/components/ItemPreview/ItemPrice';
import TokenOwner from '@marketplace/components/TokenPreview/TokenOwner';
import { AuctionWinner } from '@marketplace/components/auction/Auction/AuctionDetails/AuctionWinner';
import BestBid from '@marketplace/components/auction/BestBid';
import { BidsCount } from '@marketplace/components/auction/BidsCount';
import BidField from '@marketplace/components/buyActions/BidField';
import BuyField from '@marketplace/components/buyActions/BuyField';
import FlexToken from '@marketplace/components/token/FlexToken';
import TokenFavoriteButton from '@marketplace/components/token/TokenFavoriteButton';
import useGetAuctionDetails from '@marketplace/hooks/offers/useGetAuctionDetails';
import useGetTokenSingleSaleDetails from '@marketplace/hooks/offers/useGetTokenSingleSaleDetails';

import { PromotedToken_token } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  gap: var(--double-unit);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TokenFavoriteButtonWrapper = styled.div`
  margin-left: auto;
  align-self: flex-start;
`;

const Card = styled.div`
  width: var(--card-width, calc(10 * var(--unit)));
  display: flex;
  align-items: center;
`;

const PriceWrapper = styled.div`
  h6 {
    font-size: 18px;
  }
`;

const CardSerial = styled(Caption)`
  text-align: left;
`;

const SaleInfo = styled.div`
  display: flex;
  gap: var(--half-unit);
  flex-direction: column;
  flex: 1 1 0;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
  gap: var(--half-unit);
  color: var(--c-neutral-600);
  overflow: hidden;
  max-width: 100%;
`;

const StyledCaption = styled(Caption)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-600);
`;

type Props = {
  token: PromotedToken_token;
  CardInfo: () => JSX.Element | null;
  solidFavoriteIcon?: boolean;
  alwaysShowFavoriteButton?: boolean;
  className?: string;
};

const Price = ({ token }: Omit<Props, 'CardInfo'>) => {
  const sale = useGetTokenSingleSaleDetails(token);
  const { price, currency } =
    useGetAuctionDetails(token.latestEnglishAuction) || {};

  if (sale)
    return (
      <ItemPrice
        amount={sale.weiPrice}
        referenceCurrency={SupportedCurrency.WEI}
      />
    );

  if (price && currency && token.latestEnglishAuction) {
    return (
      <>
        <ItemPrice amount={price} referenceCurrency={currency} />
        <BestBid auction={token.latestEnglishAuction} small />
      </>
    );
  }
  return null;
};

const FinalPrice = ({ token }: Omit<Props, 'CardInfo'>) => {
  const salePrice = token?.liveSingleSaleOffer?.priceWei;
  const auctionPrice =
    token?.latestEnglishAuction?.bestBid?.amount ||
    token?.latestEnglishAuction?.currentPrice;

  const auctionCurrency =
    token?.latestEnglishAuction?.bestBid?.amounts.referenceCurrency ||
    token?.latestEnglishAuction?.currency;

  const price = salePrice || auctionPrice;
  const referenceCurrency =
    (salePrice && SupportedCurrency.WEI) || auctionCurrency;

  if (price && referenceCurrency) {
    return <ItemPrice amount={price} referenceCurrency={referenceCurrency} />;
  }
  return null;
};

const Cta = ({ token }: Omit<Props, 'CardInfo'>) => {
  const sale = useGetTokenSingleSaleDetails(token);
  const auction = useGetAuctionDetails(token.latestEnglishAuction);

  if (sale) return <BuyField token={token} small stroke />;

  if (auction && token.latestEnglishAuction) {
    return (
      <BidField
        stroke
        small
        tokens={[token]}
        auction={token.latestEnglishAuction}
      />
    );
  }
  return null;
};

const FooterInfo = ({ token }: Omit<Props, 'CardInfo'>) => {
  const sale = useGetTokenSingleSaleDetails(token);
  const auction = useGetAuctionDetails(token.latestEnglishAuction);

  if (sale) return <TokenOwner token={token} />;

  if (auction && token.latestEnglishAuction) {
    return <BidsCount auction={token.latestEnglishAuction} />;
  }
  return null;
};

const EndDate = ({ token }: Omit<Props, 'CardInfo'>) => {
  const sale = useGetTokenSingleSaleDetails(token);
  const auction = useGetAuctionDetails(token.latestEnglishAuction);

  if (sale?.endDate) return <ItemEndDate endDate={sale.endDate} />;
  if (auction?.endDate) return <ItemEndDate endDate={auction.endDate} />;
  return null;
};

const EndInfo = ({ token }: Omit<Props, 'CardInfo'>) => {
  const sale = token.liveSingleSaleOffer;
  const auction = token.latestEnglishAuction;

  if (sale) {
    // TODO: Replace with more detailed sale info
    return (
      <StyledCaption as="div">
        <FormattedMessage
          id="PromotedToken.SaleEnded"
          defaultMessage="Sale Ended"
        />
        {' · '}
        <Since date={sale.endDate} />
      </StyledCaption>
    );
  }
  if (auction) {
    return auction.bestBid ? (
      <AuctionWinner auction={auction} />
    ) : (
      <StyledCaption as="div">
        <FormattedMessage
          id="PromotedToken.AuctionEnded"
          defaultMessage="Auction Ended"
        />
        {' · '}
        <Since date={auction.endDate} />
      </StyledCaption>
    );
  }
  return null;
};

export const PromotedToken = ({
  token,
  CardInfo,
  alwaysShowFavoriteButton = false,
  solidFavoriteIcon = true,
  className,
}: Props) => {
  const [hoveredItem, setHoveredItem] = useState<boolean>(false);

  const auction = token.latestEnglishAuction;
  const auctionEndDate = auction?.endDate && parseISO(auction.endDate);
  const auctionEnded = auctionEndDate && isPast(auctionEndDate);

  const sale = token.liveSingleSaleOffer;
  const saleEndDate = sale?.endDate && parseISO(sale.endDate);
  const saleEnded = saleEndDate && isPast(saleEndDate);

  const ended = auctionEnded || saleEnded;

  return (
    <Wrapper
      className={className}
      onMouseEnter={() => setHoveredItem(true)}
      onMouseLeave={() => setHoveredItem(false)}
    >
      <Card>
        <FlexToken token={token} width={160} />
      </Card>
      <SaleInfo>
        <Header>
          {CardInfo && <CardInfo />}
          <TokenFavoriteButtonWrapper>
            <TokenFavoriteButton
              show={alwaysShowFavoriteButton || hoveredItem}
              solid={solidFavoriteIcon}
              token={token}
            />
          </TokenFavoriteButtonWrapper>
        </Header>

        <CardSerial>
          {token.metadata.seasonStartYear}
          <span> • </span>
          {getHumanReadableSerialNumber({
            rarity: token.metadata.rarity,
            serialNumber: token.metadata.serialNumber,
            sport: token.sport,
          })}
        </CardSerial>
        <div>
          <PriceWrapper>
            {ended ? <FinalPrice token={token} /> : <Price token={token} />}
          </PriceWrapper>
          <Footer>
            {ended ? (
              <EndInfo token={token} />
            ) : (
              <>
                <FooterInfo token={token} />
                <span> • </span>
                <EndDate token={token} />
              </>
            )}
          </Footer>
        </div>
        <Cta token={token} />
      </SaleInfo>
    </Wrapper>
  );
};

PromotedToken.fragments = {
  token: gql`
    fragment PromotedToken_token on Token {
      assetId
      slug
      sport
      metadata {
        ... on TokenBaseballMetadata {
          id
        }
        ... on TokenFootballMetadata {
          id
        }
        ... on TokenCardMetadataInterface {
          rarity
          serialNumber
        }
      }
      latestEnglishAuction {
        id
        currency
        bestBid {
          id
          amount
          amounts {
            eur
            usd
            wei
            gbp
            referenceCurrency
          }
        }
        ...BestBid_auction
        ...BidField_auction
        ...BidsCount_auction
        ...useGetAuctionDetails_auction
        ...AuctionWinner_auction
      }
      ...FlexToken_token
      ...BuyField_token
      ...TokenOwner_token
      ...useGetTokenSingleSaleDetails_token
    }
    ${FlexToken.fragments.token}
    ${BuyField.fragments.token}
    ${BestBid.fragments.auction}
    ${BidField.fragments.auction}
    ${TokenOwner.fragments.token}
    ${BidsCount.fragments.auction}
    ${useGetAuctionDetails.fragments.auction}
    ${AuctionWinner.fragments.auction}
    ${useGetTokenSingleSaleDetails.fragments.token}
  `,
};
