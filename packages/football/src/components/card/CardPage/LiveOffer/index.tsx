import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Block from '@sorare/core/src/atoms/layout/Block';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';

import { LiveOffer_tokenOffer } from './__generated__/index.graphql';

interface Props {
  offer: LiveOffer_tokenOffer;
}

export const LiveOffer = ({ offer }: Props) => {
  const { showNotification } = useSnackNotificationContext();
  const [cancelling, toggleCancelling] = useToggle(false);
  const cancelOffer = useCancelOffer();
  const { formatDate } = useIntlContext();

  const cancel = async () => {
    toggleCancelling();
    const errors = await cancelOffer(offer.blockchainId!);

    if (!errors) showNotification('directOfferCancelled');
    toggleCancelling();
  };

  return (
    <Block compact inline>
      <div>
        <Text16>
          {formatDate(offer.createdAt, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Text16>
        <AmountWithConversion monetaryAmount={offer.senderSide.amounts} />
      </div>
      <Button
        stroke
        color="red"
        onClick={() => {
          cancel();
        }}
        disabled={cancelling}
      >
        <FormattedMessage {...glossary.cancel} />
      </Button>
    </Block>
  );
};

LiveOffer.fragments = {
  tokenOffer: gql`
    fragment LiveOffer_tokenOffer on Offer {
      id
      createdAt
      senderSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      blockchainId
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<LiveOffer_tokenOffer>,
};

export default LiveOffer;
