import { TypedDocumentNode, gql } from '@apollo/client';

import {
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import NewOfferBuilder, {
  SharedProps as NewOfferBuilderSharedProps,
} from '../NewOfferBuilder';
import { CounterOfferBuilder_tokenOffer } from './__generated__/index.graphql';

interface Props extends NewOfferBuilderSharedProps {
  previousOffer: CounterOfferBuilder_tokenOffer;
}

const CounterOfferBuilder = ({
  onClose,
  to,
  previousOffer,
  currentUser,
}: Props) => {
  const {
    walletPreferences: { showFiatWallet },
    fiatCurrency,
  } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();
  const tokens = [
    ...previousOffer.senderSide.nfts,
    ...previousOffer.receiverSide.nfts,
  ];

  const counterOfferSport =
    tokens.length > 0 ? tokens[0].sport : Sport.CRICKET;

  const receiveAmount = toMonetaryAmount(previousOffer.senderSide.amounts);
  const receiveMarketFeesAmount =
    previousOffer?.marketFeeAmounts &&
    toMonetaryAmount(previousOffer.marketFeeAmounts);
  const sendAmount = toMonetaryAmount(previousOffer.receiverSide.amounts);
  return (
    <NewOfferBuilder
      receiveCards={previousOffer.senderSide.nfts}
      receiveAmount={receiveAmount}
      receiveMarketFeesAmount={receiveMarketFeesAmount || undefined}
      sendCards={previousOffer.receiverSide.nfts}
      sendAmount={sendAmount}
      onClose={onClose}
      to={to}
      counterOfferId={previousOffer.id!}
      counterOfferSport={counterOfferSport}
      currentUser={currentUser}
      lockReceiveEthInput={receiveAmount.eur <= 0}
      {...(showFiatWallet && {
        referenceCurrency:
          previousOffer.senderSide.amounts.referenceCurrency ===
          SupportedCurrency.WEI
            ? previousOffer.senderSide.amounts.referenceCurrency
            : (fiatCurrency.code as SupportedCurrency),
      })}
    />
  );
};
CounterOfferBuilder.fragments = {
  tokenOffer: gql`
    fragment CounterOfferBuilder_tokenOffer on Offer {
      id
      blockchainId
      marketFeeAmountWei
      marketFeeAmounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
      sender {
        ... on User {
          slug
          ...NewOfferBuilder_publicUserInfoInterface
        }
      }
      senderSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          sport
          ...NewOfferBuilder_token
        }
      }
      receiver {
        ... on User {
          slug
          ...NewOfferBuilder_publicUserInfoInterface
        }
      }
      receiverSide {
        id
        wei
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          sport
          ...NewOfferBuilder_token
        }
      }
    }
    ${monetaryAmountFragment}
    ${NewOfferBuilder.fragments.token}
    ${NewOfferBuilder.fragments.user}
  ` as TypedDocumentNode<CounterOfferBuilder_tokenOffer>,
};
export default CounterOfferBuilder;
