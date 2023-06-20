import { gql, useMutation } from '@apollo/client';
import { ComponentType, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import Dialog, { Actions } from '@sorare/core/src/atoms/layout/Dialog';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import {
  GraphqlForm,
  TextFieldWithConversion,
} from '@sorare/core/src/components/form/Form';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { fromWei, toWei } from '@sorare/core/src/lib/wei';

import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';

import {
  CreateOrUpdateSingleBuyOfferMinPriceMutation,
  CreateOrUpdateSingleBuyOfferMinPriceMutationVariables,
  SetupMinimumPriceDialog_token,
} from './__generated__/index.graphql';

const messages = defineMessages({
  amountPrivate: {
    id: 'SetupMinPriceDialog.amountPrivate',
    defaultMessage: 'Keep the amount secret',
  },
  disclaimer: {
    id: 'SetupMinPriceDialog.disclaimer',
    defaultMessage: 'You will not receive the offers under your minimum price',
  },
  disclaimerLegend: {
    id: 'SetupMinPriceDialog.disclaimerLegend',
    defaultMessage: '* Minimum price you receive after fees',
  },
  submit: {
    id: 'SetupMinPriceDialog.submit',
    defaultMessage: 'Save',
  },
});

interface Props {
  open: boolean;
  onClose: () => void;
  token: SetupMinimumPriceDialog_token;
  title: string;
}

const SetupMinimumPriceDialogFragments = {
  token: gql`
    fragment SetupMinimumPriceDialog_token on Token {
      assetId
      slug
      privateMinPrice
      publicMinPrice
    }
  `,
};

const CREATE_OR_UPDATE_SINGLE_BUY_OFFER_MIN_PRICE_MUTATION = gql`
  mutation CreateOrUpdateSingleBuyOfferMinPriceMutation(
    $input: createOrUpdateSingleBuyOfferMinPriceInput!
  ) {
    createOrUpdateSingleBuyOfferMinPrice(input: $input) {
      token {
        assetId
        slug
        ...SetupMinimumPriceDialog_token
      }
    }
  }
  ${SetupMinimumPriceDialogFragments.token}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const SetupMinimumPriceDialog = ({ onClose, open, token, title }: Props) => {
  const { formatMessage } = useIntl();
  const { privateMinPrice, publicMinPrice } = token;
  const {
    transferMarket: { cardEthMinPrice },
  } = useConfigContext();
  const [updateMinPrice] = useMutation<
    CreateOrUpdateSingleBuyOfferMinPriceMutation,
    CreateOrUpdateSingleBuyOfferMinPriceMutationVariables
  >(CREATE_OR_UPDATE_SINGLE_BUY_OFFER_MIN_PRICE_MUTATION);

  const { secondaryMarketFeesRate } = useMarketplaceContext();

  const minPrice = privateMinPrice || publicMinPrice;

  const initialEthPrice = minPrice
    ? fromWei(minPrice)
    : cardEthMinPrice.toString();

  const [keepPrivate, setKeepPrivate] = useState(!!privateMinPrice);

  const handleChecked = (event: any) => setKeepPrivate(event.target.checked);

  const submit = async (
    attributes: {
      price: string;
    },
    onResult: (result: any) => void,
    onCancel: () => void
  ) => {
    await updateMinPrice({
      variables: {
        input: {
          amount: toWei(attributes.price),
          isPrivate: keepPrivate,
          assetId: token.assetId,
        },
      },
    }).then(
      ({ data: mutationData }) => {
        if (mutationData) {
          onResult(mutationData.createOrUpdateSingleBuyOfferMinPrice);
        }
      },
      () => {
        setTimeout(() => onCancel(), 500);
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div>
        <Text16>
          <FormattedMessage {...messages.disclaimer} />{' '}
          {secondaryMarketFeesRate > 0 && <>*</>}
        </Text16>
      </div>
      <GraphqlForm
        onSubmit={(attributes, onResult, onCancel) => {
          submit(attributes, onResult, onCancel);
        }}
        onSuccess={onClose}
        render={(Error: ComponentType, SubmitButton: ComponentType) => (
          <Content>
            <Error />
            <TextFieldWithConversion
              name="price"
              defaultEthValue={initialEthPrice.toString()}
            />
            {secondaryMarketFeesRate > 0 && (
              <Caption color="var(--c-neutral-600)">
                <FormattedMessage {...messages.disclaimerLegend} />
              </Caption>
            )}
            <Checkbox
              checked={keepPrivate}
              onChange={handleChecked}
              label={formatMessage(messages.amountPrivate)}
            />
            <Actions>
              <SubmitButton>{formatMessage(messages.submit)}</SubmitButton>
            </Actions>
          </Content>
        )}
      />
    </Dialog>
  );
};

SetupMinimumPriceDialog.fragments = SetupMinimumPriceDialogFragments;

export default SetupMinimumPriceDialog;
