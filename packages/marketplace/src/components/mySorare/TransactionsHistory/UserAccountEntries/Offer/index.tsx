import { TypedDocumentNode, gql } from '@apollo/client';
import Big from 'bignumber.js';
import { useIntl } from 'react-intl';

import {
  Currency,
  MonetaryAmount,
  UserAccountEntryEntry,
} from '@sorare/core/src/__generated__/globalTypes';
import {
  AccountEntry,
  messages,
} from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/AccountEntry';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMonetaryAmount, {
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { isType } from '@sorare/core/src/lib/gql';
import {
  getMonetaryAmountIndex,
  monetaryAmountFragment,
} from '@sorare/core/src/lib/monetaryAmount';

import FeesDetailsTooltip from '@marketplace/components/offer/FeesDetailsTooltip';

import { TransactionsOffer } from '../../common/TransactionsOffer';
import { Offer_userAccountEntry } from './__generated__/index.graphql';

type Props = {
  userAccountEntry: Offer_userAccountEntry;
  userAccountEntryFees?: Offer_userAccountEntry;
  primaryCurrency: Currency;
};

export const Offer = ({
  userAccountEntry,
  userAccountEntryFees,
  primaryCurrency,
}: Props) => {
  const { tokenOperation } = userAccountEntry;

  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();
  const { toMonetaryAmount } = useMonetaryAmount();

  if (
    !currentUser ||
    !tokenOperation ||
    userAccountEntry.entryType === UserAccountEntryEntry.PAYMENT_FEE
  ) {
    return null;
  }

  if (!isType(tokenOperation, 'Offer') || !tokenOperation.sender) {
    return null;
  }

  const receiver = tokenOperation.receiver || tokenOperation.actualReceiver;

  if (
    (receiver && !isType(receiver, 'User')) ||
    !isType(tokenOperation.sender, 'User')
  ) {
    return null;
  }

  const tokenOperationFeeMonetary =
    tokenOperation?.marketFeeAmounts &&
    toMonetaryAmount(tokenOperation.marketFeeAmounts);

  const marketFeeAmounts =
    userAccountEntryFees?.amounts &&
    toMonetaryAmount(userAccountEntryFees.amounts);

  const receiverSideAmounts = toMonetaryAmount(
    tokenOperation.receiverSide.amounts
  );

  const senderSideAmounts = toMonetaryAmount(tokenOperation.senderSide.amounts);

  const data =
    tokenOperation.sender.slug === currentUser.slug
      ? {
          title: messages.offerTitleAsSender,
          otherParty: receiver,
          receiveAmounts: receiverSideAmounts,
          sendAmounts: senderSideAmounts,
        }
      : {
          title: messages.offerTitleAsReceiver,
          otherParty: tokenOperation.sender,
          receiveAmounts: senderSideAmounts,
          sendAmounts: receiverSideAmounts,
        };

  const monetaryAmountIndex = getMonetaryAmountIndex(
    userAccountEntry.amounts.referenceCurrency
  );
  const totalAmounts = toMonetaryAmount({
    [getMonetaryAmountIndex(userAccountEntry.amounts.referenceCurrency)]:
      new Big(userAccountEntry.amounts[monetaryAmountIndex!]!).plus(
        marketFeeAmounts?.[monetaryAmountIndex] || 0
      ),
    referenceCurrency: userAccountEntry.amounts.referenceCurrency,
  });

  const userAccountEntryWithFees = {
    ...userAccountEntry,
    amounts: {
      __typename: 'MonetaryAmount' as MonetaryAmount['__typename'],
      ...totalAmounts,
      referenceCurrency: userAccountEntry.amounts.referenceCurrency,
    },
  };

  return (
    <AccountEntry
      userAccountEntry={userAccountEntryWithFees}
      primaryCurrency={primaryCurrency}
      tooltip={
        data.receiveAmounts.eur > 0 &&
        tokenOperationFeeMonetary &&
        tokenOperationFeeMonetary.eur > 0 && (
          <FeesDetailsTooltip
            completed
            monetaryAmount={data.receiveAmounts}
            marketFeeMonetaryAmount={
              (tokenOperation?.marketFeeAmounts &&
                toMonetaryAmount(tokenOperation.marketFeeAmounts)) ||
              zeroMonetaryAmount
            }
            referenceCurrency={userAccountEntry.amounts.referenceCurrency}
          />
        )
      }
      title={formatMessage(data.title, {
        otherParty: data.otherParty && <Nickname user={data.otherParty as any} />,
      })}
    >
      <TransactionsOffer tokenOffer={tokenOperation} />
    </AccountEntry>
  );
};

Offer.fragments = {
  userAccountEntry: gql`
    fragment Offer_userAccountEntry on UserAccountEntry {
      id
      aasmState
      entryType
      amounts {
        ...MonetaryAmountFragment_monetaryAmount
      }
      tokenOperation {
        ... on Offer {
          id
          marketFeeAmounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
          receiverSide {
            id
            amounts {
              ...MonetaryAmountFragment_monetaryAmount
            }
          }
          senderSide {
            id
            amounts {
              ...MonetaryAmountFragment_monetaryAmount
            }
          }
          ...TransactionsOffer_tokenOffer
        }
      }
      ...AccountEntry_userAccountEntry
    }
    ${monetaryAmountFragment}
    ${AccountEntry.fragments.userAccountEntry}
    ${TransactionsOffer.fragments.tokenOffer}
  ` as TypedDocumentNode<Offer_userAccountEntry>,
};
