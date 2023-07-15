import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import {
  GraphqlForm,
  TextFieldWithConversion,
} from '@sorare/core/src/components/form/Form';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { fromWei, toWei } from '@sorare/core/src/lib/wei';

import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';

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

const CenteredText16 = styled(Text16)`
  text-align: center;
`;
const Body = styled.div`
  padding: var(--triple-unit);
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
`;
const SubmitButtonWrapper = styled.div`
  padding-top: var(--double-unit);
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
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      title={<CenteredText16>{title}</CenteredText16>}
      body={
        <Body>
          <Text16>
            <FormattedMessage {...messages.disclaimer} />{' '}
            {secondaryMarketFeesRate > 0 && <>*</>}
          </Text16>
          <StyledGraphqlForm
            onSubmit={(attributes, onResult, onCancel) => {
              submit(attributes, onResult, onCancel);
            }}
            onSuccess={onClose}
            render={(Error, SubmitButton) => (
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
                <SubmitButtonWrapper>
                  <SubmitButton fullWidth>
                    {formatMessage(messages.submit)}
                  </SubmitButton>
                </SubmitButtonWrapper>
              </Content>
            )}
          />
        </Body>
      }
    />
  );
};

SetupMinimumPriceDialog.fragments = SetupMinimumPriceDialogFragments;

export default SetupMinimumPriceDialog;
