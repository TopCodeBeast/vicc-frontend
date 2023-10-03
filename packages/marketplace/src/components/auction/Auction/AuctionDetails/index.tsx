import { TypedDocumentNode, gql } from '@apollo/client';
import classNames from 'classnames';
import { isPast, parseISO } from 'date-fns';

import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import ViccUser from '@sorare/core/src/components/user/SorareUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { ItemSpecialRewardBadge } from '@marketplace/components/ItemPreview/ItemSpecialRewardBadge';
import {
  ButtonContainer,
  TokenDetailsInfos,
  TokenDetailsRoot,
  TokenDetailsRow,
} from '@marketplace/components/ItemPreview/ui';
import { AuctionStatus } from '@marketplace/components/auction/AuctionStatus';
import BidField from '@marketplace/components/buyActions/BidField';
import useTokenTakesPartPromotionalEvent from '@marketplace/hooks/offers/useTokenTakesPartPromotionalEvent';
import {
  auctionCurrentPrice,
  promotionalEventsExcludeSpecialRewardBadge,
} from '@marketplace/lib/auctions';

import { AuctionWinner } from './AuctionWinner';
import { AuctionDetails_auction } from './__generated__/index.graphql';

type Props = {
  auction: AuctionDetails_auction;
  isDesktopLayout: boolean;
  hideViccUser?: boolean;
  showWinnerWhenEnded?: boolean;
  allowColumnLayout?: boolean;
  useConversionRate?: boolean;
};

export const AuctionDetails = ({
  auction,
  isDesktopLayout,
  hideViccUser,
  showWinnerWhenEnded,
  allowColumnLayout,
  useConversionRate = false,
}: Props) => {
  const {
    flags: { useSportWithUncoloredCta = [] },
  } = useFeatureFlags();
  const takesPartInEvent = useTokenTakesPartPromotionalEvent();

  const currentPriceMonetary = auctionCurrentPrice(auction);
  const { open } = auction;
  const endDate = auction.endDate && parseISO(auction.endDate);
  const hasEnded = endDate && isPast(endDate) && !open;
  const tokens = auction.nfts;
  const promotionalEvent = takesPartInEvent(tokens);
  const buttonColor = useSportWithUncoloredCta.includes(tokens[0].sport)
    ? 'mediumGray'
    : 'blue';

  return (
    <TokenDetailsRoot className={classNames({ allowColumnLayout })}>
      <TokenDetailsInfos>
        <div>
          <TokenDetailsRow>
            <AmountWithConversion
              monetaryAmount={
                !useConversionRate && hasEnded && auction.bestBid
                  ? auction.bestBid.amounts
                  : currentPriceMonetary
              }
            />
          </TokenDetailsRow>
          {promotionalEvent &&
            !promotionalEventsExcludeSpecialRewardBadge.includes(
              promotionalEvent.name
            ) && <ItemSpecialRewardBadge event={promotionalEvent} />}
          <TokenDetailsRow>
            {hasEnded && showWinnerWhenEnded ? (
              <AuctionWinner auction={auction} />
            ) : (
              <AuctionStatus auction={auction} />
            )}
          </TokenDetailsRow>
        </div>
        {isDesktopLayout && !hideViccUser && (
          <TokenDetailsRow>
            <ViccUser />
          </TokenDetailsRow>
        )}
      </TokenDetailsInfos>
      {!hasEnded && (
        <ButtonContainer>
          <BidField
            color={buttonColor}
            small
            auction={auction}
            tokens={tokens}
            stroke
          />
        </ButtonContainer>
      )}
    </TokenDetailsRoot>
  );
};

AuctionDetails.fragments = {
  auction: gql`
    fragment AuctionDetails_auction on Auction {
      id
      open
      bestBid {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      nfts {
        assetId
        slug
        sport
        ...BidField_token
      }
      ...BidField_auction
      ...AuctionStatus_auction
      ...auctionCurrentPrice_auction
      ...AuctionWinner_auction
      ...auctionCurrentPrice_auction
    }
    ${monetaryAmountFragment}
    ${auctionCurrentPrice.fragments.auction}
    ${BidField.fragments.token}
    ${BidField.fragments.auction}
    ${AuctionStatus.fragments.auction}
    ${auctionCurrentPrice.fragments.auction}
    ${AuctionWinner.fragments.auction}
  ` as TypedDocumentNode<AuctionDetails_auction>,
};
