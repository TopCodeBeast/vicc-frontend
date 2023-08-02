import { TypedDocumentNode, gql } from '@apollo/client';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import useHasInsufficientFundsInWallets from '@marketplace/hooks/useHasInsufficientFundsInWallets';

import TokensAvailableOnPrimary from '../TokensAvailableOnPrimary';
import { TokensAvailableOnPrimaryWhenInsufficientFundsInWallet_token } from './__generated__/index.graphql';

type Props = {
  token: TokensAvailableOnPrimaryWhenInsufficientFundsInWallet_token;
  hitsPerRow: number;
  sport?: Sport;
};

export const TokensAvailableOnPrimaryWhenInsufficientFundsInWallet = ({
  token,
  hitsPerRow,
  sport,
}: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const {
    metadata: { playerSlug, rarity },
    liveSingleSaleOffer,
    myMintedSingleSaleOffer,
  } = token;

  const hasInsufficientFundsInWallets = useHasInsufficientFundsInWallets();

  const belongsToUser = useTokenOfferBelongsToUser();

  if (
    !sport ||
    !liveSingleSaleOffer ||
    (myMintedSingleSaleOffer && belongsToUser(myMintedSingleSaleOffer))
  )
    return null;

  const {
    receiverSide: { amounts },
  } = liveSingleSaleOffer;

  const { insufficientFundsInEthWallet } = hasInsufficientFundsInWallets(
    toMonetaryAmount(amounts)
  );
  if (insufficientFundsInEthWallet) return null;

  return (
    <TokensAvailableOnPrimary
      rarity={rarity}
      playerSlug={playerSlug}
      hitsPerRow={hitsPerRow}
      sport={sport}
    />
  );
};

TokensAvailableOnPrimaryWhenInsufficientFundsInWallet.fragments = {
  token: gql`
    fragment TokensAvailableOnPrimaryWhenInsufficientFundsInWallet_token on Token {
      assetId
      slug
      metadata {
        ... on TokenCardMetadataInterface {
          id
          rarity
          playerSlug
        }
      }
      liveSingleSaleOffer {
        id
        receiverSide {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
      myMintedSingleSaleOffer {
        id
        ...useTokenOfferBelongsToUser_offer
      }
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<TokensAvailableOnPrimaryWhenInsufficientFundsInWallet_token>,
};
export default TokensAvailableOnPrimaryWhenInsufficientFundsInWallet;
