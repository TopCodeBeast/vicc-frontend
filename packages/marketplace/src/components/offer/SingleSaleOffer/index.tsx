import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text16 } from '@sorare/core/src/atoms/typography';
import ActiveUserAvatar from '@sorare/core/src/components/user/ActiveUserAvatar';
import {
  GalleryLink,
  useCurrentSportGallery,
} from '@sorare/core/src/components/user/GalleryLink';
import UserName from '@sorare/core/src/components/user/UserName';
import useMonetaryAmount, {
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import BuyField from '@marketplace/components/buyActions/BuyField';
import MakeOffer from '@marketplace/components/directOffer/MakeOffer';

import FeesDetailsTooltip from '../FeesDetailsTooltip';
import { SingleSaleOfferDetails } from './SingleSaleOfferDetails';
import { SingleSaleOffer_token } from './__generated__/index.graphql';

const SaleDetailsContainer = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: baseline;
`;

type Props = {
  token: SingleSaleOffer_token;
};

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--unit);
  gap: var(--half-unit);
`;
const SoldBy = styled(Text16)`
  display: flex;
  white-space: pre-wrap;
  & a {
    text-decoration: underline;
  }
`;
const Root = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media ${tabletAndAbove} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const Right = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;

export const SingleSaleOffer = ({ token }: Props) => {
  const currentSportGallery = useCurrentSportGallery();
  const { toMonetaryAmount } = useMonetaryAmount();
  const belongsToUser = useTokenOfferBelongsToUser();

  const { myMintedSingleSaleOffer, liveSingleSaleOffer, owner } = token;

  const offer =
    liveSingleSaleOffer ||
    (myMintedSingleSaleOffer && belongsToUser(myMintedSingleSaleOffer)
      ? myMintedSingleSaleOffer
      : null);
  const user = owner?.user;

  if (!user || user.suspended || !offer) return null;

  const {
    receiverSide: { amounts },
    endDate,
  } = offer;

  const priceMonetaryAmount = toMonetaryAmount(amounts);
  const { marketFeeAmounts } = myMintedSingleSaleOffer || {};
  const marketFeeMonetaryAmount =
    (marketFeeAmounts && toMonetaryAmount(marketFeeAmounts)) ||
    zeroMonetaryAmount;
  return (
    <div>
      <Title>
        <ActiveUserAvatar user={user} variant="small" />
        <SoldBy bold>
          <FormattedMessage
            id="SingleSaleOffer.listedBy"
            defaultMessage="Listed by {nickname}"
            values={{
              nickname: (
                <GalleryLink
                  user={user}
                  galleryPathFactory={currentSportGallery}
                >
                  <UserName user={user} />
                </GalleryLink>
              ),
            }}
          />
        </SoldBy>
      </Title>
      <Root>
        <SaleDetailsContainer>
          <SingleSaleOfferDetails
            priceMonetaryAmount={priceMonetaryAmount}
            endDate={endDate}
            cancelled={false}
          />
          {myMintedSingleSaleOffer &&
            liveSingleSaleOffer &&
            belongsToUser(myMintedSingleSaleOffer) &&
            marketFeeMonetaryAmount.eur > 0 && (
              <FeesDetailsTooltip
                monetaryAmount={toMonetaryAmount(
                  liveSingleSaleOffer.receiverSide.amounts
                )}
                marketFeeMonetaryAmount={marketFeeMonetaryAmount}
                referenceCurrency={
                  liveSingleSaleOffer.receiverSide.amounts.referenceCurrency
                }
              />
            )}
        </SaleDetailsContainer>
        <Right>
          <MakeOffer token={token} />
          <BuyField token={token} medium />
        </Right>
      </Root>
    </div>
  );
};

SingleSaleOffer.fragments = {
  token: gql`
    fragment SingleSaleOffer_token on Token {
      assetId
      slug
      owner {
        id
        user {
          slug
          ...ActiveUserAvatar_user
          ...UserName_publicUserInfoInterface
        }
      }
      liveSingleSaleOffer {
        id
        endDate
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
      myMintedSingleSaleOffer {
        id
        endDate
        marketFeeAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        sender {
          ... on User {
            slug
          }
        }
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
      ...BuyField_token
      ...MakeOffer_token
    }
    ${monetaryAmountFragment}
    ${BuyField.fragments.token}
    ${MakeOffer.fragments.token}
    ${ActiveUserAvatar.fragments.user}
    ${UserName.fragments.user}
  ` as TypedDocumentNode<SingleSaleOffer_token>,
};

export default SingleSaleOffer;
