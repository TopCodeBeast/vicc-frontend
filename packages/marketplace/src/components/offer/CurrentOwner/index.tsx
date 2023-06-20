import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SettlementDelayReason } from '@sorare/core/src/__generated__/globalTypes';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { isA } from '@sorare/core/src/lib/gql';

import MakeOffer from 'components/directOffer/MakeOffer';
import Sell from 'components/offer/Sell';
import {
  singleSaleOfferContextFragments,
  useSingleSaleOfferContext,
} from 'contexts/singleSaleOffer';
import useBelongsToUser from 'hooks/offers/useBelongsToUser';

import OwnerAccount from '../OwnerAccount';
import UnavailableAfterConversionCreditBuyHelpers from '../UnavailableAfterConversionCreditBuyHelpers';
import CurrentOwnerSection from './CurrentOwnerSection';
import { CurrentOwner_token } from './__generated__/index.graphql';

type CurrentOwner_token_owner_account_owner_Contract = NonNullable<
  NonNullable<CurrentOwner_token['owner']>['account']
>['owner'] & {
  __typename: 'Contract';
};

type Props = {
  token: CurrentOwner_token;
};

const Optimistic = styled(Text16)`
  color: var(--c-yellow-600);
`;

export const CurrentOwner = ({ token }: Props) => {
  const belongsToUser = useBelongsToUser();
  const { showPopin } = useSingleSaleOfferContext();
  const {
    latestEnglishAuction,
    liveSingleSaleOffer,
    myMintedSingleSaleOffer,
    owner,
  } = token;

  const notOwnedOrOwnByAContract =
    !owner ||
    isA<CurrentOwner_token_owner_account_owner_Contract>(
      'Contract',
      owner.account?.owner
    );

  const onSale =
    myMintedSingleSaleOffer && belongsToUser(myMintedSingleSaleOffer);

  useEffect(() => {
    if (onSale) {
      showPopin({ assetId: token.assetId });
    }
  }, [onSale, showPopin, token.assetId]);

  if (notOwnedOrOwnByAContract && !owner?.user) return null;
  if (latestEnglishAuction?.open || liveSingleSaleOffer) return null;
  if (onSale) return null;

  const unavailableAfterConversionCreditBuy =
    !!token?.owner?.settleAt &&
    token?.owner?.settlementDelayReason ===
      SettlementDelayReason.CONVERSION_CREDIT_USED;
  return (
    <CurrentOwnerSection
      actions={
        !owner?.user?.suspended && (
          <>
            <MakeOffer token={token} />
            <Sell token={token} />
          </>
        )
      }
      helpers={<UnavailableAfterConversionCreditBuyHelpers token={token} />}
      disabled={!!owner?.optimistic && unavailableAfterConversionCreditBuy}
    >
      <OwnerAccount account={owner.account}>
        {owner.optimistic && !unavailableAfterConversionCreditBuy ? (
          <Optimistic>
            <FormattedMessage
              id="CurrentOwner.optimistic"
              defaultMessage="Transfer in progress"
            />
          </Optimistic>
        ) : (
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage id="CurrentOwner.owner" defaultMessage="Owner" />
          </Caption>
        )}
      </OwnerAccount>
    </CurrentOwnerSection>
  );
};

CurrentOwner.fragments = {
  token: gql`
    fragment CurrentOwner_token on Token {
      assetId
      slug
      id
      collection
      owner {
        id
        optimistic
        blockchain
        settlementDelayReason
        account {
          id
          owner {
            ... on User {
              slug
            }
            ... on Contract {
              id
            }
          }
          ...OwnerAccount_account
        }
        user {
          slug
          suspended
        }
      }
      latestEnglishAuction {
        id
        open
      }
      liveSingleSaleOffer {
        id
      }
      myMintedSingleSaleOffer {
        id
        sender {
          ... on User {
            slug
          }
        }
      }
      ...SellCard_token
      ...MakeOffer_token
      ...SingleSaleOfferContext_token
      ...UnavailableAfterConversionCreditBuyHelpers_token
    }
    ${Sell.fragments.token}
    ${singleSaleOfferContextFragments.token}
    ${OwnerAccount.fragments.account}
    ${MakeOffer.fragments.token}
    ${UnavailableAfterConversionCreditBuyHelpers.fragments.token}
  `,
};

export default CurrentOwner;
