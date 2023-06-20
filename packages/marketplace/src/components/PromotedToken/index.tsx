import { gql } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import { getHumanReadableSerialNumber } from '@sorare/core/src/lib/cards';

import ItemEndDate from 'components/ItemPreview/ItemEndDate';
import ItemPrice from 'components/ItemPreview/ItemPrice';
import TokenOwner from 'components/TokenPreview/TokenOwner';
import BestBid from 'components/auction/BestBid';
import { BidsCount } from 'components/auction/BidsCount';
import BidField from 'components/buyActions/BidField';
import BuyField from 'components/buyActions/BuyField';
import FlexToken from 'components/token/FlexToken';
import TokenFavoriteButton from 'components/token/TokenFavoriteButton';
import useGetAuctionDetails from 'hooks/offers/useGetAuctionDetails';
import useGetTokenSingleSaleDetails from 'hooks/offers/useGetTokenSingleSaleDetails';

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

type Props = {
  token: PromotedToken_token;
  CardInfo: () => JSX.Element | null;
  solidFavoriteIcon?: boolean;
  alwaysShowFavoriteButton?: boolean;
  className?: string;
};

const Price = ({ token }: Omit<Props, 'CardInfo'>) => {
  const sale = useGetTokenSingleSaleDetails(token);
  const auction = useGetAuctionDetails(token.latestEnglishAuction);

  if (sale) return <ItemPrice wei={sale.weiPrice} />;

  if (auction && token.latestEnglishAuction) {
    return (
      <>
        <ItemPrice wei={auction.weiPrice} />
        <BestBid auction={token.latestEnglishAuction} small />
      </>
    );
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

export const PromotedToken = ({
  token,
  CardInfo,
  alwaysShowFavoriteButton = false,
  solidFavoriteIcon = true,
  className,
}: Props) => {
  const [hoveredItem, setHoveredItem] = useState<boolean>(false);
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
            <Price token={token} />
          </PriceWrapper>
          <Footer>
            <FooterInfo token={token} />
            <span> • </span>
            <EndDate token={token} />
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
        ...BestBid_auction
        ...BidField_auction
        ...BidsCount_auction
        ...useGetAuctionDetails_auction
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
    ${useGetTokenSingleSaleDetails.fragments.token}
  `,
};
