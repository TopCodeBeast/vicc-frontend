import { gql } from '@apollo/client';
import classNames from 'classnames';
import { isPast, parseISO } from 'date-fns';

import AmountWithConversion from '@sorare/core/src/components/buyActions/AmountWithConversion';
import SorareUser from '@sorare/core/src/components/user/SorareUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import ItemPrice from '@sorare/marketplace/src/components/ItemPreview/ItemPrice';
import { ItemSpecialRewardBadge } from '@sorare/marketplace/src/components/ItemPreview/ItemSpecialRewardBadge';
import {
  ButtonContainer,
  TokenDetailsInfos,
  TokenDetailsRoot,
  TokenDetailsRow,
} from '@sorare/marketplace/src/components/ItemPreview/ui';
import { AuctionStatus } from '@sorare/marketplace/src/components/auction/AuctionStatus';
import BidField from '@sorare/marketplace/src/components/buyActions/BidField';
import useTokenTakesPartPromotionalEvent from '@sorare/marketplace/src/hooks/offers/useTokenTakesPartPromotionalEvent';
import {
  auctionCurrentPrice,
  promotionalEventsExcludeSpecialRewardBadge,
} from '@sorare/marketplace/src/lib/auctions';

import { AuctionWinner } from './AuctionWinner';
import { AuctionDetails_auction } from './__generated__/index.graphql';

type Props = {
  auction: AuctionDetails_auction;
  isDesktopLayout: boolean;
  hideSorareUser?: boolean;
  showWinnerWhenEnded?: boolean;
  allowColumnLayout?: boolean;
  useConversionRate?: boolean;
};

export const AuctionDetails = ({
  auction,
  isDesktopLayout,
  hideSorareUser,
  showWinnerWhenEnded,
  allowColumnLayout,
  useConversionRate = false,
}: Props) => {
  const {
    flags: { useSportWithUncoloredCta = [] },
  } = useFeatureFlags();
  const takesPartInEvent = useTokenTakesPartPromotionalEvent();

  const weiPrice = auctionCurrentPrice(auction);
  const endDate = auction.endDate && parseISO(auction.endDate);
  const hasEnded = endDate && isPast(endDate);
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
            {!useConversionRate && hasEnded && auction.bestBid ? (
              <AmountWithConversion
                context="MySorareAuctionEnded"
                amount={auction.bestBid.amount}
                amountInFiat={auction.bestBid.amountInFiat}
                unit="wei"
              />
            ) : (
              <ItemPrice wei={weiPrice} />
            )}
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
        {isDesktopLayout && !hideSorareUser && (
          <TokenDetailsRow>
            <SorareUser />
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
    fragment AuctionDetails_auction on TokenAuction {
      id
      bestBid {
        amount
        amountInFiat {
          eur
          gbp
          usd
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
    }
    ${BidField.fragments.token}
    ${BidField.fragments.auction}
    ${AuctionStatus.fragments.auction}
    ${auctionCurrentPrice.fragments.auction}
    ${AuctionWinner.fragments.auction}
  `,
};
