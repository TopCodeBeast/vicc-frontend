import {
  faCircleExclamation,
  faInfoCircle,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, Divider, RadioGroup } from '@material-ui/core';
import { ReactNode, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  Currency,
  FiatWalletAccountState,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { ChevronDownBold } from '@sorare/core/src/atoms/icons/ChevronDownBold';
import { Radio } from '@sorare/core/src/atoms/inputs/Radio';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  Text14,
  Text16,
  Title5,
  Title6,
} from '@sorare/core/src/atoms/typography';
import CreditCard from '@sorare/core/src/components/buyActions/CreditCard';
import AddCreditCardForm from '@sorare/core/src/components/creditCard/AddCreditCardForm';
import NewCreditCard from '@sorare/core/src/components/creditCard/NewCreditCard';
import { CreateFiatWalletWithInterstitialModal } from '@sorare/core/src/components/fiatWallet/CreateFiatWalletWithInterstitialModal';
import { InterstitialContextModalMode } from '@sorare/core/src/components/fiatWallet/InterstitialContextModal';
import {
  AUCTION_MARKET_URL,
  STARTER_BUNDLES_URL,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import {
  WalletTab,
  useWalletDrawerContext,
} from '@sorare/core/src/contexts/walletDrawer';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useMangopayCreditCardsEnabled from '@sorare/core/src/hooks/useMangopayCreditCardsEnabled';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { glossary, wallet } from '@sorare/core/src/lib/glossary';

import { usePaymentContext } from '@marketplace/components/buyActions/Context';
import AddStripeCreditCardForm from '@marketplace/components/buyActions/PaymentBox/Methods/AddStripeCreditCardForm';
import EthWallet from '@marketplace/components/buyActions/PaymentBox/Methods/EthWallet';
import FiatWallet from '@marketplace/components/buyActions/PaymentBox/Methods/FiatWallet';
import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';

import PaymentRequest from './PaymentRequest';
import {
  CrediCardPaymentMethod,
  OrderedPaymentMethod,
  PaymentMethod,
} from './types';
import { useOrderedPaymentMethods } from './useOrderedPaymentMethods';

export * from './types';

const Wrapper = styled.div`
  border: solid 1px var(--c-neutral-400);
  padding: var(--double-unit);
  border-radius: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--double-unit);
  justify-content: space-between;
`;

const StyledButtonBase = styled(ButtonBase)`
  width: var(--triple-unit);
  border-radius: var(--double-unit);
`;

const Helper = styled.div<{ center?: boolean }>`
  display: flex;
  ${({ center }) => (center ? 'align-items: center;' : '')}
  gap: var(--unit);
  background-color: var(--c-neutral-200);
  border: solid 1px var(--c-neutral-400);
  border-radius: var(--unit);
  padding: var(--intermediate-unit);
  .dark-theme & {
    background-color: var(--c-neutral-300);
  }
  &.red {
    background-color: rgba(var(--c-rgb-red-600), 0.05);
    border: solid 1px var(--c-red-600);
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Gap = styled.div`
  display: flex;
  height: var(--double-unit);
`;

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-400);
`;

const SimpleButton = styled.button`
  .dark-theme & {
    text-decoration: underline;
    color: var(--c-link);
  }
`;

const Reverse = styled.div<{ enable: boolean }>`
  transition: 0.3s;
  transform: ${({ enable }) => (enable ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const CTA = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--unit);
  font-size: var(--t-16);
  color: var(--c-neutral-500);
  margin-top: var(--half-unit);
`;

type Props = {
  sport: Sport;
  closePaymentBox?: () => void;
  creditCardMethodsDisabled?: boolean;
  selectedPaymentMethod: OrderedPaymentMethod | null;
  setSelectedPaymentMethod: (p: OrderedPaymentMethod) => void;
  onMangopayCardChange: (card: any) => void;
};

export const Methods = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  sport,
  closePaymentBox,
  creditCardMethodsDisabled,
  onMangopayCardChange,
}: Props) => {
  const [showCreateFiatWallet, setShowCreateFiatWallet] =
    useState<boolean>(false);
  const { canDepositAndWithdraw } = useFiatBalance();
  const { showDrawer, setCurrentTab } = useWalletDrawerContext();
  const {
    walletPreferences: { showFiatWallet, showEthWallet, onlyShowFiatCurrency },
  } = useCurrentUserContext();

  const {
    flags: { useCashWallet = false },
  } = useFeatureFlags();
  const useMangopayCreditCards = useMangopayCreditCardsEnabled();

  const {
    insufficientFundsInEthWallet,
    insufficientFundsInFiatWallet,
    paymentMethods,
    canMakePaymentWithPaymentRequest,
    currencies,
    setPaymentMethod,
    cardRegistrationErrors,
    buyOnAuctionPoweredByAlgolia,
    saveCreditCard,
    toggleSaveCreditCard,
  } = usePaymentContext();

  const fiatPaymentEnabled = currencies.includes(Currency.FIAT);
  const ethPaymentEnabled = currencies.includes(Currency.ETH);
  const ethPaymentDisabled = !ethPaymentEnabled;

  const [dropdown, toggleDropdown] = useToggle(false);

  const { isSelected, reorderMethods, orderedPaymentMethods } =
    useOrderedPaymentMethods({
      creditCardMethodsDisabled,
      selectedPaymentMethod,
      setSelectedPaymentMethod,
    });

  const hideRadioButton = (pm: OrderedPaymentMethod) =>
    isSelected(pm) && !dropdown;

  const addFunds = useCallback(
    (c: Currency) => {
      showDrawer();
      setCurrentTab(
        c === Currency.ETH
          ? WalletTab.ADD_FUNDS_TO_ETH_WALLET
          : WalletTab.ADD_FUNDS_TO_FIAT_WALLET
      );
      if (closePaymentBox) closePaymentBox();
    },
    [closePaymentBox, setCurrentTab, showDrawer]
  );

  const addFundsToFiatWallet = useCallback(() => {
    if (canDepositAndWithdraw) {
      addFunds(Currency.FIAT);
    } else {
      setShowCreateFiatWallet(true);
    }
  }, [canDepositAndWithdraw, addFunds]);

  const toggleDropdownAndReorderMethods = () => {
    toggleDropdown();
    reorderMethods();
  };

  const paymentOptions: Record<string, ReactNode> = {
    [PaymentMethod.ETH_WALLET]: (
      <div>
        <Radio
          key={PaymentMethod.ETH_WALLET}
          onChange={() => {
            setSelectedPaymentMethod(PaymentMethod.ETH_WALLET);
            setPaymentMethod(WalletPaymentMethod.ETH_WALLET);
          }}
          checked={isSelected(PaymentMethod.ETH_WALLET)}
          labelContent={<EthWallet />}
          value={PaymentMethod.ETH_WALLET}
          reverse
          name={PaymentMethod.ETH_WALLET}
          hideRadio={hideRadioButton(PaymentMethod.ETH_WALLET)}
          checkedColor="var(--c-brand-600)"
          disabled={ethPaymentDisabled}
        />
        <Collapse
          key="addCreditCardForm"
          in={
            insufficientFundsInEthWallet && isSelected(PaymentMethod.ETH_WALLET)
          }
          collapsedSize={0}
        >
          <Gap />
          <Helper className="red" key="insufficientFundsInEthWallet">
            <div>
              <FontAwesomeIcon
                icon={faCircleExclamation}
                color="var(--c-red-600)"
              />
            </div>
            <div>
              <Text16 color="var(--c-neutral-1000)">
                <FormattedMessage
                  id="NewPaymentBox.methods.insufficientFunds"
                  defaultMessage="Your wallet is running low on funds. Add funds with card or ETH wallet and come back to grab this card."
                />
              </Text16>
              <SimpleButton
                onClick={() => addFunds(Currency.ETH)}
                type="button"
              >
                <Text16 bold color="var(--c-link)">
                  <FormattedMessage {...wallet.addFunds} />
                </Text16>
              </SimpleButton>
            </div>
          </Helper>
        </Collapse>
      </div>
    ),
    [PaymentMethod.FIAT_WALLET]: (
      <div>
        {showCreateFiatWallet && (
          <CreateFiatWalletWithInterstitialModal
            onDismissActivationSuccess={() => setShowCreateFiatWallet(false)}
            statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
            onClose={() => setShowCreateFiatWallet(false)}
            canDismissAfterActivation
            onDecline={() => setShowCreateFiatWallet(false)}
            mode={InterstitialContextModalMode.DEPOSIT}
          />
        )}
        <Radio
          key={PaymentMethod.FIAT_WALLET}
          onChange={() => {
            setSelectedPaymentMethod(PaymentMethod.FIAT_WALLET);
            setPaymentMethod(WalletPaymentMethod.FIAT_WALLET);
          }}
          checked={isSelected(PaymentMethod.FIAT_WALLET)}
          labelContent={<FiatWallet />}
          value={PaymentMethod.FIAT_WALLET}
          reverse
          name={PaymentMethod.FIAT_WALLET}
          hideRadio={hideRadioButton(PaymentMethod.FIAT_WALLET)}
          checkedColor="var(--c-brand-600)"
          disabled={!fiatPaymentEnabled}
        />
        <Collapse
          key="addCreditCardForm"
          in={
            insufficientFundsInFiatWallet &&
            isSelected(PaymentMethod.FIAT_WALLET)
          }
          collapsedSize={0}
        >
          <Gap />
          <Helper className="red" key="insufficientFundsInFiatWallet">
            <div>
              <FontAwesomeIcon
                icon={faCircleExclamation}
                color="var(--c-red-600)"
              />
            </div>
            <div>
              <Text16 color="var(--c-neutral-1000)">
                <FormattedMessage
                  id="NewPaymentBox.methods.sorareWallet.insufficientFunds"
                  defaultMessage="Your wallet is running low on funds. Add funds and come back to grab this card."
                />
              </Text16>
              <SimpleButton onClick={addFundsToFiatWallet} type="button">
                <Text16 bold color="var(--c-link)">
                  <FormattedMessage {...wallet.addFunds} />
                </Text16>
              </SimpleButton>
            </div>
          </Helper>
        </Collapse>
      </div>
    ),
    ...(!useMangopayCreditCards
      ? {
          [PaymentMethod.NEW_CREDIT_CARD]: (
            <div>
              <Radio
                key={PaymentMethod.NEW_CREDIT_CARD}
                onChange={() => {
                  setSelectedPaymentMethod(PaymentMethod.NEW_CREDIT_CARD);
                  setPaymentMethod(null);
                }}
                disabled={!fiatPaymentEnabled || creditCardMethodsDisabled}
                checked={isSelected(PaymentMethod.NEW_CREDIT_CARD)}
                labelContent={<NewCreditCard />}
                value={PaymentMethod.NEW_CREDIT_CARD}
                reverse
                name={PaymentMethod.NEW_CREDIT_CARD}
                hideRadio={
                  !dropdown && isSelected(PaymentMethod.NEW_CREDIT_CARD)
                }
                checkedColor="var(--c-brand-600)"
              />
              <Collapse
                key="addCreditCardForm"
                in={isSelected(PaymentMethod.NEW_CREDIT_CARD)}
                collapsedSize={0}
              >
                <Gap />
                <AddStripeCreditCardForm
                  visible={isSelected(PaymentMethod.NEW_CREDIT_CARD)}
                />
              </Collapse>
            </div>
          ),
        }
      : {}),
    ...(useMangopayCreditCards
      ? {
          [PaymentMethod.NEW_MANGOPAY_CREDIT_CARD]: (
            <div>
              <Radio
                key={PaymentMethod.NEW_MANGOPAY_CREDIT_CARD}
                onChange={() => {
                  setSelectedPaymentMethod(
                    PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
                  );
                  setPaymentMethod(null);
                }}
                disabled={!fiatPaymentEnabled || creditCardMethodsDisabled}
                checked={isSelected(PaymentMethod.NEW_MANGOPAY_CREDIT_CARD)}
                labelContent={<NewCreditCard />}
                value={PaymentMethod.NEW_MANGOPAY_CREDIT_CARD}
                reverse
                name={PaymentMethod.NEW_MANGOPAY_CREDIT_CARD}
                hideRadio={
                  !dropdown &&
                  isSelected(PaymentMethod.NEW_MANGOPAY_CREDIT_CARD)
                }
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
                  visible={isSelected(PaymentMethod.NEW_MANGOPAY_CREDIT_CARD)}
                  onChange={onMangopayCardChange}
                />
              </Collapse>
            </div>
          ),
        }
      : {}),
    ...(paymentMethods &&
      paymentMethods.length > 0 &&
      paymentMethods?.reduce<Record<CrediCardPaymentMethod, ReactNode>>(
        (acc, pm) => {
          const id: CrediCardPaymentMethod = `credit_card_${pm.id}`;
          return {
            ...acc,
            [id]: (
              <Radio
                key={pm.id}
                name="paymentMethod"
                value={pm.id}
                checked={isSelected(id)}
                disabled={!fiatPaymentEnabled || creditCardMethodsDisabled}
                labelContent={
                  <CreditCard creditCard={pm.card} selected={isSelected(id)} />
                }
                onChange={() => {
                  setSelectedPaymentMethod(id);
                  setPaymentMethod(pm);
                }}
                reverse
                hideRadio={hideRadioButton(id)}
                checkedColor="var(--c-brand-600)"
              />
            ),
          };
        },
        {}
      )),
    ...(!useMangopayCreditCards
      ? {
          [PaymentMethod.PAYMENT_REQUEST]: (
            <Radio
              key={PaymentMethod.PAYMENT_REQUEST}
              onChange={() => {
                setSelectedPaymentMethod(PaymentMethod.PAYMENT_REQUEST);
                setPaymentMethod(null, true);
              }}
              disabled={!fiatPaymentEnabled || creditCardMethodsDisabled}
              checked={isSelected(PaymentMethod.PAYMENT_REQUEST)}
              labelContent={
                <PaymentRequest
                  canMakePayment={canMakePaymentWithPaymentRequest}
                />
              }
              value={PaymentMethod.PAYMENT_REQUEST}
              reverse
              name={PaymentMethod.PAYMENT_REQUEST}
              hideRadio={hideRadioButton(PaymentMethod.PAYMENT_REQUEST)}
              checkedColor="var(--c-brand-600)"
            />
          ),
        }
      : {}),
  };

  const [firstOrderedPaymentMethod, ...otherOrderedPaymentMethods] =
    orderedPaymentMethods;

  const payingWithFiatDisabled =
    useCashWallet && !fiatPaymentEnabled && !creditCardMethodsDisabled;
  const payingWithCCDisabledButCashWalletAllowed =
    useCashWallet && fiatPaymentEnabled && creditCardMethodsDisabled;
  const payingWithEthWalletDisabled =
    ethPaymentDisabled && !onlyShowFiatCurrency;

  return (
    <Wrapper>
      <Header>
        <Title5>
          <FormattedMessage {...glossary.payWith} />
        </Title5>
        {orderedPaymentMethods.length > 1 && (
          <StyledButtonBase
            onClick={() => {
              toggleDropdownAndReorderMethods();
            }}
            disableDebounce
            aria-label="dropdown-toggle"
          >
            <Reverse enable={dropdown}>
              <ChevronDownBold color="var(--c-brand-600)" />
            </Reverse>
          </StyledButtonBase>
        )}
      </Header>
      {orderedPaymentMethods.length === 0 ? (
        <LoadingIndicator small />
      ) : (
        <StyledRadioGroup>
          <Group>{paymentOptions[firstOrderedPaymentMethod]}</Group>
          <Collapse in={dropdown} collapsedSize={0}>
            <Gap />
            <Group>
              {useCashWallet &&
                firstOrderedPaymentMethod !== PaymentMethod.FIAT_WALLET &&
                fiatPaymentEnabled &&
                showFiatWallet &&
                paymentOptions[PaymentMethod.FIAT_WALLET]}
              {firstOrderedPaymentMethod !== PaymentMethod.ETH_WALLET &&
                ethPaymentEnabled &&
                showEthWallet &&
                paymentOptions[PaymentMethod.ETH_WALLET]}
              {!useCashWallet &&
                !fiatPaymentEnabled &&
                !creditCardMethodsDisabled && (
                  <>
                    <Divider />
                    <Helper>
                      <div>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          color="var(--c-neutral-600)"
                        />
                      </div>
                      <div>
                        <Title6 color="var(--c-neutral-1000)">
                          <FormattedMessage
                            id="NewPaymentBox.methods.cardUnavailable.title"
                            defaultMessage="Credit/Debit card payments unavailable on Manager Sales"
                          />
                        </Title6>
                        <Text14 color="var(--c-neutral-1000)">
                          <FormattedMessage
                            id="NewPaymentBox.methods.cardUnavailable.desc"
                            defaultMessage="Credit/Debit card payments are only available for Auction and Starter Pack purchases."
                          />
                        </Text14>
                        <CTA>
                          <Link to={AUCTION_MARKET_URL[sport]}>
                            <FormattedMessage
                              id="NewPaymentBox.methods.cardUnavailable.auctionCTA"
                              defaultMessage="Buy in Auction"
                            />
                          </Link>
                          <p>|</p>
                          <Link to={STARTER_BUNDLES_URL[sport]}>
                            <FormattedMessage
                              id="NewPaymentBox.methods.cardUnavailable.starterPacksCTA"
                              defaultMessage="Buy Starter Packs"
                            />
                          </Link>
                        </CTA>
                      </div>
                    </Helper>
                  </>
                )}
              {payingWithFiatDisabled && (
                <>
                  <Divider />
                  <Group key="fiat-unavailable">
                    <Text16 color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="NewPaymentBox.methods.ethWallet.unavailable"
                        defaultMessage="Unavailable"
                      />
                    </Text16>
                    {paymentOptions[PaymentMethod.FIAT_WALLET]}
                  </Group>
                </>
              )}
              {payingWithCCDisabledButCashWalletAllowed && (
                <>
                  <Divider />
                  <Group key="cc-unavailable-for-usd">
                    <Text16 color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="NewPaymentBox.methods.ethWallet.unavailable"
                        defaultMessage="Unavailable"
                      />
                    </Text16>
                  </Group>
                </>
              )}
              {otherOrderedPaymentMethods
                .filter(
                  pm =>
                    pm !== PaymentMethod.ETH_WALLET &&
                    pm !== PaymentMethod.FIAT_WALLET
                )
                .map(pm => (
                  <Group key={pm}>{paymentOptions[pm]}</Group>
                ))}
              {!fiatPaymentEnabled &&
                !useCashWallet &&
                buyOnAuctionPoweredByAlgolia}
              {payingWithFiatDisabled && (
                <Helper center>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <Text16 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="NewPaymentBox.methods.ethWallet.exclusive.desc"
                      defaultMessage="The seller does not accept cash."
                    />
                  </Text16>
                </Helper>
              )}
              {useCashWallet &&
                fiatPaymentEnabled &&
                creditCardMethodsDisabled && (
                  <Helper center>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <Text16 color="var(--c-neutral-600)">
                      <FormattedMessage
                        id="NewPaymentBox.methods.comingSoon.helper"
                        defaultMessage="Payment cards coming soon on USD."
                      />
                    </Text16>
                  </Helper>
                )}
              {payingWithEthWalletDisabled && (
                <>
                  {!payingWithCCDisabledButCashWalletAllowed && <Divider />}
                  <Group key={Currency.ETH}>
                    <div>
                      {!payingWithCCDisabledButCashWalletAllowed && (
                        <Text16 color="var(--c-neutral-600)">
                          <FormattedMessage
                            id="NewPaymentBox.methods.ethWallet.unavailable"
                            defaultMessage="Unavailable"
                          />
                        </Text16>
                      )}
                      {paymentOptions[PaymentMethod.ETH_WALLET]}
                    </div>
                    <Helper center>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <Text16 color="var(--c-neutral-600)">
                        <FormattedMessage
                          id="NewPaymentBox.methods.ethWallet.unavailable.desc"
                          defaultMessage="The seller does not accept ETH."
                        />
                      </Text16>
                    </Helper>
                  </Group>
                </>
              )}
            </Group>
          </Collapse>
        </StyledRadioGroup>
      )}
    </Wrapper>
  );
};

export default Methods;
