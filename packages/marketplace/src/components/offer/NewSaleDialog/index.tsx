import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';

import { AmountInput, Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Caption } from '@sorare/core/src/atoms/typography';
import useSnackErrorHandler from '@sorare/core/src/hooks/useSnackErrorHandler';
import { MonetaryAmountParams } from '@sorare/core/src/lib/monetaryAmount';

import useCreateSingleSaleOffer from '@marketplace/hooks/offers/useCreateSingleSaleOffer';

import OfferDialog from '../OfferDialog';
import { NewSaleDialog_token } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'NewSaleDialog.title',
    defaultMessage: 'List your Card for sale',
  },
  description: {
    id: 'NewSaleDialog.warningDescription',
    defaultMessage:
      'If your Card is sold it will be removed from any teams you have setup for upcoming tournaments.',
  },
  cta: {
    id: 'NewSaleDialog.submit',
    defaultMessage: 'List',
  },
  confirmationMessage: {
    id: 'NewSaleDialog.listedPrice',
    defaultMessage: 'Listed Price',
  },
});

export interface Props {
  open: boolean;
  onClose: () => void;
  token: NewSaleDialog_token;
  initialAmount?: MonetaryAmountParams;
}

const NewSaleDialog = ({ token, onClose, open, initialAmount }: Props) => {
  const createOffer = useCreateSingleSaleOffer();
  const snackErrorHandler = useSnackErrorHandler();

  const submit = async ({
    amountInput,
    duration,
    legacyWeiAmount,
  }: {
    amountInput: AmountInput;
    legacyWeiAmount: string;
    duration?: number;
  }) => {
    await snackErrorHandler(createOffer)({
      amountInput,
      legacyWeiAmount,
      token,
      duration,
    });
  };

  return (
    <OfferDialog
      token={token}
      showSaleDuration
      open={open}
      cta={messages.cta}
      onClose={onClose}
      submit={submit}
      title={messages.title}
      description={
        // Football cards follow list or play rule and have dedicated warnings
        token.sport !== Sport.CRICKET && (
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage {...messages.description} />
          </Caption>
        )
      }
      confirmationMessage={messages.confirmationMessage}
      minimumPrice={token.priceRange?.min}
      initialAmount={initialAmount}
    />
  );
};

NewSaleDialog.fragments = {
  token: gql`
    fragment NewSaleDialog_token on Token {
      assetId
      slug
      sport
      priceRange {
        min
        max
      }
      ...useCreateSingleSaleOffer_token
      ...OfferDialog_token
    }
    ${useCreateSingleSaleOffer.fragments.token}
    ${OfferDialog.fragments.token}
  ` as TypedDocumentNode<NewSaleDialog_token>,
};

export default NewSaleDialog;
