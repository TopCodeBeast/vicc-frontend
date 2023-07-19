import { gql } from '@apollo/client';

import {
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';

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

  const { priceWei } = liveSingleSaleOffer;

  const { insufficientFundsInEthWallet } = hasInsufficientFundsInWallets(
    toMonetaryAmount({
      wei: priceWei,
      referenceCurrency: SupportedCurrency.WEI,
    })
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
        priceWei: price
      }
      myMintedSingleSaleOffer {
        id
        ...useTokenOfferBelongsToUser_offer
      }
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
  `,
};
export default TokensAvailableOnPrimaryWhenInsufficientFundsInWallet;
