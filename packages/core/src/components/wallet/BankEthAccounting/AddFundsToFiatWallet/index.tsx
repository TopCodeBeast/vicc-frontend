import { faMoneyBillTransfer } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatCurrency } from '__generated__/globalTypes';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import Radio from '@core/atoms/inputs/Radio';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16 } from '@core/atoms/typography';
import CreditCard from '@core/components/buyActions/CreditCard';
import AddCreditCardForm, {
  CreditCardFormResult,
} from '@core/components/creditCard/AddCreditCardForm';
import NewCreditCard from '@core/components/creditCard/NewCreditCard';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { useCurrentUsersPaymentMethods } from '@core/hooks/creditCard/useCurrentUsersPaymentMethods';
import { useRegisterMangopayCard } from '@core/hooks/creditCard/useRegisterMangopayCard';
import { useValidateCardDetails } from '@core/hooks/creditCard/useValidateCardDetails';
import useToggle from '@core/hooks/useToggle';

import { DepositAccepted } from './DepositAccepted';
import { SelectAmount } from './SelectAmount';
import { Summary } from './Summary';
import { GenericWireTransfer, WireTransfer } from './WireTransfer';

const messages = defineMessages({
  saveCreditCardLabel: {
    id: 'AddFundsToFiatWallet.saveCreditCardLabel',
    defaultMessage: 'Vicc will save your payment info for next time.',
  },
});

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const IconContainer = styled.div`
  background-color: var(--c-neutral-300);
  padding: var(--half-unit) var(--unit);
  border-radius: var(--half-unit);
`;

enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  NEW_CREDIT_CARD = 'new_credit_card',
  NEW_MANGOPAY_CREDIT_CARD = 'new_mangopay_credit_card',
}

const Options = styled.div`
  > div {
    border: 1px solid var(--c-neutral-400);
    border-bottom: none;

    &:first-child {
      border-top-left-radius: var(--unit);
      border-top-right-radius: var(--unit);
    }

    &:last-child {
      border-bottom-left-radius: var(--unit);
      border-bottom-right-radius: var(--unit);
      border-bottom: 1px solid var(--c-neutral-400);
    }
  }
`;

const OptionWrapper = styled.div``;

const RadioWrapper = styled.div`
  padding: var(--double-unit);
`;

const OptionRoot = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const CollapseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding: var(--double-unit);
  padding-top: 0;
`;

const Gap = styled.div`
  height: var(--double-unit);
`;

const AddFundsToFiatWallet = () => {
  const { currentUser, fiatWalletAccountable } = useCurrentUserContext();
  const validateCardDetails = useValidateCardDetails();
  const { currentTab, setCurrentTab } = useWalletDrawerContext();
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [paymentMethods, paymentMethodsLoading, refetch] =
    useCurrentUsersPaymentMethods(currentUser);
  const [cardDetails, setCardDetails] = useState<CreditCardFormResult>();
  const [amount, setAmount] = useState<number | undefined>();
  const registerMangopayCard = useRegisterMangopayCard();
  const [saveCreditCard, toggleSaveCreditCard] = useToggle(false);
  const [shouldSaveCreditCard, setShouldSaveCreditCard] = useState(false);
  const [cardRegistrationProcessing, setCardRegistrationProcessing] =
    useState(false);
  const [cardRegistrationErrors, setCardRegistrationErrors] = useState<
    string[]
  >([]);

  const [showGenericWireTransferDetails, setShowGenericWireTransferDetails] =
    useState(false);

  const onAmountChange = (newAmount: string) => {
    setAmount(+newAmount);
  };

  const onSuccess = useCallback(() => {
    setCurrentTab(WalletTab.ADD_FUNDS_TO_FIAT_WALLET_SUCCEEDED);
  }, [setCurrentTab]);

  const onChange = useCallback((card: CreditCardFormResult) => {
    setCardDetails(card);
  }, []);

  const registerCard = useCallback(
    async (newCardDetails: CreditCardFormResult) => {
      setCardRegistrationProcessing(true);
      const registerCardResult = await registerMangopayCard(newCardDetails);
      if (registerCardResult.errors) {
        setCardRegistrationErrors(registerCardResult.errors);
      } else if (registerCardResult?.cardId) {
        setShouldSaveCreditCard(saveCreditCard);
        setPaymentMethod(registerCardResult?.cardId);
        await refetch();
        setCurrentTab(WalletTab.ADD_FUNDS_TO_FIAT_WALLET_REVIEW);
      }
      setCardRegistrationProcessing(false);
    },
    [saveCreditCard, registerMangopayCard, setCurrentTab, refetch]
  );

  const isSelected = (pm: string) => pm === paymentMethod;

  const selectedCreditCard = paymentMethods?.find(method =>
    isSelected(method.id)
  );

  const isGenericWireTransfer =
    fiatWalletAccountable &&
    paymentMethod === PaymentMethod.BANK_TRANSFER &&
    fiatWalletAccountable.currency !== FiatCurrency.EUR;

  const creditCardUnsupported =
    !fiatWalletAccountable?.currency ||
    fiatWalletAccountable.currency === FiatCurrency.USD;

  const displayButton =
    paymentMethod !== PaymentMethod.BANK_TRANSFER || isGenericWireTransfer;

  if (currentTab === WalletTab.ADD_FUNDS_TO_FIAT_WALLET_SUCCEEDED && amount)
    return <DepositAccepted amount={amount} />;

  if (
    currentTab === WalletTab.ADD_FUNDS_TO_FIAT_WALLET_REVIEW &&
    amount &&
    paymentMethod
  )
    return (
      <Summary
        amount={amount}
        cardId={paymentMethod}
        onSuccess={onSuccess}
        saveCreditCard={shouldSaveCreditCard}
        creditCardPreview={
          selectedCreditCard ? (
            <>
              <Text16 bold>
                <FormattedMessage
                  id="addFundsToFiatWallet.payWith.title"
                  defaultMessage="Pay with"
                />
              </Text16>
              <CreditCard
                creditCard={selectedCreditCard.card}
                selected={false}
              />
            </>
          ) : null
        }
      />
    );

  if (showGenericWireTransferDetails && amount)
    return <GenericWireTransfer amount={amount} />;

  return (
    <Content>
      <SelectAmount onChange={onAmountChange} />
      <Text16 bold>
        <FormattedMessage
          id="addFundsToFiatWallet.payWith.title"
          defaultMessage="Pay with"
        />
      </Text16>
      {paymentMethodsLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Options>
            {!creditCardUnsupported && (
              <>
                {paymentMethods &&
                  paymentMethods.length > 0 &&
                  paymentMethods?.map(pm => {
                    return (
                      <RadioWrapper key={pm.id}>
                        <Radio
                          name="paymentMethod"
                          value={pm.id}
                          checked={isSelected(pm.id)}
                          labelContent={
                            <CreditCard
                              creditCard={pm.card}
                              selected={isSelected(pm.id)}
                            />
                          }
                          onChange={() => {
                            setPaymentMethod(pm.id);
                          }}
                          reverse
                          checkedColor="var(--c-brand-600)"
                        />
                      </RadioWrapper>
                    );
                  })}
                <OptionWrapper>
                  <RadioWrapper>
                    <Radio
                      key={PaymentMethod.NEW_MANGOPAY_CREDIT_CARD}
                      onChange={() => {
                        setPaymentMethod(
                          PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
                        );
                      }}
                      checked={isSelected(
                        PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
                      )}
                      labelContent={<NewCreditCard />}
                      value={PaymentMethod.NEW_MANGOPAY_CREDIT_CARD}
                      reverse
                      name={PaymentMethod.NEW_MANGOPAY_CREDIT_CARD}
                      checkedColor="var(--c-brand-600)"
                    />

                    <Collapse
                      key="addMangopayCreditCardForm"
                      in={isSelected(PaymentMethod.NEW_MANGOPAY_CREDIT_CARD)}
                      collapsedSize={0}
                    >
                      <Gap />
                      <AddCreditCardForm
                        error={cardRegistrationErrors}
                        saveCreditCard={saveCreditCard}
                        toggleSaveCreditCard={toggleSaveCreditCard}
                        visible={isSelected(
                          PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
                        )}
                        onChange={onChange}
                        saveCreditCardLabel={messages.saveCreditCardLabel}
                      />
                    </Collapse>
                  </RadioWrapper>
                </OptionWrapper>
              </>
            )}
            <OptionWrapper>
              <RadioWrapper>
                <Radio
                  onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)}
                  value="bank"
                  name="bank"
                  checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
                  reverse
                  checkedColor="var(--c-brand-600)"
                  labelContent={
                    <OptionRoot>
                      <IconContainer>
                        <FontAwesomeIcon size="xl" icon={faMoneyBillTransfer} />
                      </IconContainer>
                      <Text16>
                        <FormattedMessage
                          id="AddFundsToFiatWallet.wireTransfer"
                          defaultMessage="Wire transfer"
                        />
                      </Text16>
                    </OptionRoot>
                  }
                />
              </RadioWrapper>
              {fiatWalletAccountable &&
                fiatWalletAccountable.currency === FiatCurrency.EUR && (
                  <Collapse in={paymentMethod === PaymentMethod.BANK_TRANSFER}>
                    <CollapseContent>
                      <WireTransfer
                        visible={paymentMethod === PaymentMethod.BANK_TRANSFER}
                      />
                    </CollapseContent>
                  </Collapse>
                )}
            </OptionWrapper>
          </Options>
          {displayButton && (
            <LoadingButton
              fullWidth
              loading={cardRegistrationProcessing}
              color="blue"
              disabled={
                !paymentMethod ||
                !amount ||
                (paymentMethod === PaymentMethod.NEW_MANGOPAY_CREDIT_CARD &&
                  !validateCardDetails(cardDetails))
              }
              medium
              onClick={() => {
                if (isGenericWireTransfer && amount) {
                  setShowGenericWireTransferDetails(true);
                  return;
                }
                if (
                  paymentMethod === PaymentMethod.NEW_MANGOPAY_CREDIT_CARD &&
                  cardDetails
                ) {
                  registerCard(cardDetails);
                } else {
                  setShouldSaveCreditCard(true);
                  setCurrentTab(WalletTab.ADD_FUNDS_TO_FIAT_WALLET_REVIEW);
                }
              }}
            >
              {isGenericWireTransfer ? (
                <FormattedMessage
                  id="AddFundsToFiatWallet.seeAccountDetails"
                  defaultMessage="See account details"
                />
              ) : (
                <FormattedMessage
                  id="AddFundsToFiatWallet.reviewDeposit"
                  defaultMessage="Review deposit"
                />
              )}
            </LoadingButton>
          )}
        </>
      )}
    </Content>
  );
};

export default AddFundsToFiatWallet;
