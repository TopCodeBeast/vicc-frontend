import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { Field, GraphqlForm } from '@sorare/core/src/components/form/Form';
import MonetaryInputField from '@sorare/core/src/components/form/Form/MonetaryInputField';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import {
  AcceptedCurrenciesValue,
  useAcceptedCurrencies,
} from '@sorare/core/src/hooks/useAcceptedCurrencies';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { Currency } from '@sorare/core/src/lib/currency';
import {
  MonetaryAmountCurrency,
  monetaryAmountFragment,
} from '@sorare/core/src/lib/monetaryAmount';
import {
  ETH_DECIMAL_PLACES,
  RoundingMode,
  fromWei,
  toWei,
} from '@sorare/core/src/lib/wei';

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
      privateMinPrices {
        ...MonetaryAmountFragment_monetaryAmount
      }
      publicMinPrices {
        ...MonetaryAmountFragment_monetaryAmount
      }
    }
    ${monetaryAmountFragment}
  ` as TypedDocumentNode<SetupMinimumPriceDialog_token>,
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
` as TypedDocumentNode<
  CreateOrUpdateSingleBuyOfferMinPriceMutation,
  CreateOrUpdateSingleBuyOfferMinPriceMutationVariables
>;

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
  const { privateMinPrices, publicMinPrices } = token;
  const { marketFeeRateBasisPoints } = useConfigContext();
  const { acceptedCurrencies } = useAcceptedCurrencies();
  const { toMonetaryAmount, getUserFiatAmount } = useMonetaryAmount();
  const [updateMinPrice] = useMutation(
    CREATE_OR_UPDATE_SINGLE_BUY_OFFER_MIN_PRICE_MUTATION
  );
  const { fiatCurrency } = useCurrentUserContext();

  const minPriceMonetaryAmount = privateMinPrices || publicMinPrices || null;

  const [keepPrivate, setKeepPrivate] = useState(!!privateMinPrices);

  const handleChecked = (event: any) => setKeepPrivate(event.target.checked);

  const currency =
    privateMinPrices?.referenceCurrency ||
    publicMinPrices?.referenceCurrency ||
    acceptedCurrencies === AcceptedCurrenciesValue.ETH
      ? SupportedCurrency.WEI
      : SupportedCurrency[fiatCurrency.code];

  const [monetaryAmount, setMonetaryAmount] = useState<MonetaryAmountOutput>(
    minPriceMonetaryAmount
      ? toMonetaryAmount(minPriceMonetaryAmount)
      : toMonetaryAmount({
          [currency.toLowerCase()]: '0',
          referenceCurrency: currency,
        })
  );

  const ethAmount = useMemo(
    () =>
      fromWei(monetaryAmount.wei, ETH_DECIMAL_PLACES, RoundingMode.ROUND_DOWN),
    [monetaryAmount.wei]
  );

  const onChange = (inputCurrency: Currency, inputAmount: number) => {
    const referenceCurrency =
      inputCurrency === Currency.ETH
        ? SupportedCurrency.WEI
        : SupportedCurrency[fiatCurrency.code];
    const amount =
      inputCurrency === Currency.ETH
        ? toWei(inputAmount)
        : Math.round(inputAmount * 100);
    const inputMonetaryParams = {
      referenceCurrency,
      [referenceCurrency.toLowerCase()]: amount,
    };
    setMonetaryAmount(toMonetaryAmount(inputMonetaryParams));
  };

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
          minPrice: {
            amount:
              monetaryAmount[
                currency.toLowerCase() as MonetaryAmountCurrency
              ].toString(),
            currency,
          },
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
            {marketFeeRateBasisPoints > 0 && <>*</>}
          </Text16>
          <StyledGraphqlForm
            onSubmit={(attributes, onResult, onCancel) => {
              submit(attributes, onResult, onCancel);
            }}
            onSuccess={onClose}
            render={(Error, SubmitButton) => (
              <Content>
                <Error />
                <Field
                  name="price"
                  defaultValue={ethAmount}
                  render={() => (
                    <MonetaryInputField
                      ethAmount={ethAmount}
                      fiatAmount={getUserFiatAmount(monetaryAmount) / 100}
                      defaultCurrency={
                        currency === SupportedCurrency.WEI
                          ? Currency.ETH
                          : Currency.FIAT
                      }
                      fiatCurrency={fiatCurrency.code}
                      onChange={(inputCurrency: Currency, amount: number) => {
                        onChange(inputCurrency, amount);
                      }}
                    />
                  )}
                />
                {marketFeeRateBasisPoints > 0 && (
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
