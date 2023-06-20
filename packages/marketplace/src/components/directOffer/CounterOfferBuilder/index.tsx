import { gql } from '@apollo/client';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { fromWei } from '@sorare/core/src/lib/wei';

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
  const tokens = [
    ...previousOffer.senderSide.nfts,
    ...previousOffer.receiverSide.nfts,
  ];

  const counterOfferSport =
    tokens.length > 0 ? tokens[0].sport : Sport.FOOTBALL;

  return (
    <NewOfferBuilder
      receiveCards={previousOffer.senderSide.nfts}
      receiveEth={fromWei(previousOffer.senderSide.wei)}
      receiveMarketFeesEth={
        previousOffer?.marketFeeAmountWei
          ? fromWei(previousOffer.marketFeeAmountWei)
          : 0
      }
      sendCards={previousOffer.receiverSide.nfts}
      sendEth={fromWei(previousOffer.receiverSide.wei)}
      onClose={onClose}
      to={to}
      counterOfferId={previousOffer.id!}
      counterOfferSport={counterOfferSport}
      currentUser={currentUser}
      lockReceiveEthInput={fromWei(previousOffer.senderSide.wei) <= 0}
    />
  );
};
CounterOfferBuilder.fragments = {
  tokenOffer: gql`
    fragment CounterOfferBuilder_tokenOffer on TokenOffer {
      id
      blockchainId
      marketFeeAmountWei
      sender {
        ... on User {
          slug
          ...NewOfferBuilder_publicUserInfoInterface
        }
      }
      senderSide {
        id
        wei
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
        nfts {
          assetId
          slug
          sport
          ...NewOfferBuilder_token
        }
      }
    }
    ${NewOfferBuilder.fragments.token}
    ${NewOfferBuilder.fragments.user}
  `,
};
export default CounterOfferBuilder;
