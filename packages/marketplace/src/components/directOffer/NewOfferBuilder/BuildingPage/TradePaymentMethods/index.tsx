import { TypedDocumentNode, gql } from '@apollo/client';
import { faCircleInfo, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  EnabledWallet,
  FiatWalletAccountState,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';
import { ChevronRightBold } from '@sorare/core/src/atoms/icons/ChevronRightBold';
import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import { Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { CreateFiatWalletWithInterstitialModal } from '@sorare/core/src/components/fiatWallet/CreateFiatWalletWithInterstitialModal';
import { InterstitialContextModalMode } from '@sorare/core/src/components/fiatWallet/InterstitialContextModal';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import {
  WalletTab,
  useWalletDrawerContext,
} from '@sorare/core/src/contexts/walletDrawer';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { wallet } from '@sorare/core/src/lib/glossary';

import EthWallet from '@marketplace/components/buyActions/PaymentBox/Methods/EthWallet';
import FiatWallet from '@marketplace/components/buyActions/PaymentBox/Methods/FiatWallet';
import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';
import useHasInsufficientFundsInWallets from '@marketplace/hooks/useHasInsufficientFundsInWallets';

import { setCurrencyAndPaymentMethod } from '../../actions';
import { CardDataType, StateProps } from '../../types';
import { TradePaymentMethods_publicUserInfoInterface } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Frame = styled(ButtonBase)`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  width: 100%;
  padding: var(--unit) var(--double-unit);
  border: 1px solid var(--c-neutral-400);
  border-radius: var(--double-unit);
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;
const Selected = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledChevronRightBold = styled(ChevronRightBold)<{ expanded: boolean }>`
  transform: ${({ expanded }) => (expanded ? 'rotate(90deg)' : 'rotate(0)')};
  transition: transform 0.25s ease-out;
`;
const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SimpleButton = styled.button``;

const HelperRoot = styled.div`
  width: 100%;
  background-color: rgba(var(--c-rgb-red-600), 0.05);
  padding: var(--unit);
  border-radius: var(--double-unit);
  border: solid 1px var(--c-red-600);
  display: flex;
  gap: var(--intermediate-unit);
  align-items: center;
`;

const WarningRoot = styled.div`
  width: 100%;
  padding: 0 var(--double-unit) var(--unit);
`;

const Warning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  padding: var(--intermediate-unit);
  background-color: var(--c-neutral-300);
  border: 1px solid var(--c-neutral-400);
  border-radius: var(--unit);
  color: var(--c-neutral-1000);
`;

const Helper = ({
  diffAmount,
  onClick,
}: {
  diffAmount?: string;
  onClick: () => void;
}) => (
  <HelperRoot>
    <FontAwesomeIcon icon={faInfoCircle} color="var(--c-red-600)" />
    <Text>
      <Text14 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="tradePaymentMethods.insufficientFundsInWallet"
          defaultMessage="You’ll need to add {diffAmount} to your wallet to send this trade."
          values={{
            diffAmount,
          }}
        />
      </Text14>
      <SimpleButton
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
      >
        <Text14 color="var(--c-link)">
          <FormattedMessage {...wallet.addFunds} />
        </Text14>
      </SimpleButton>
    </Text>
  </HelperRoot>
);

export const TradePaymentMethods = <D extends CardDataType>({
  state: { sendAmount, paymentMethod: selectedPaymentMethod },
  dispatch,
  onClose,
  to,
}: StateProps<D> & {
  onClose: () => void;
  to: TradePaymentMethods_publicUserInfoInterface;
}) => {
  const {
    flags: { useCashWallet },
  } = useFeatureFlags();

  const [showCreateFiatWallet, setShowCreateFiatWallet] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const { setCurrentTab, showDrawer } = useWalletDrawerContext();
  const { formatNumber, formatWei } = useIntlContext();
  const {
    currency: userSettingsCurrency,
    fiatCurrency: { code: currencyCode },
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();
  const { canDepositAndWithdraw } = useFiatBalance();
  const hasInsufficientFundsInWallets = useHasInsufficientFundsInWallets();
  const {
    insufficientFundsInEthWallet,
    diffInWeiForEthWallet,
    insufficientFundsInFiatWallet,
    diffInFiatCentsForFiatWallet,
  } = hasInsufficientFundsInWallets(sendAmount);

  const acceptEthWallet =
    to.profile.enabledWallets?.includes(EnabledWallet.ETH) ||
    to.profile.enabledWallets === null;

  useEffect(() => {
    if (selectedPaymentMethod === null) {
      if (!acceptEthWallet) {
        dispatch(
          setCurrencyAndPaymentMethod({
            paymentMethod: WalletPaymentMethod.FIAT_WALLET,
            referenceCurrency: currencyCode as SupportedCurrency,
          })
        );
        return;
      }
      dispatch(
        setCurrencyAndPaymentMethod({
          paymentMethod:
            userSettingsCurrency === Currency.ETH
              ? WalletPaymentMethod.ETH_WALLET
              : WalletPaymentMethod.FIAT_WALLET,
          referenceCurrency:
            userSettingsCurrency === Currency.ETH
              ? SupportedCurrency.WEI
              : (currencyCode as SupportedCurrency),
        })
      );
    }
  }, [
    currencyCode,
    dispatch,
    selectedPaymentMethod,
    acceptEthWallet,
    userSettingsCurrency,
  ]);

  if (!selectedPaymentMethod) return null;

  const onAddFunds = (tab: WalletTab) => {
    onClose();
    setCurrentTab(tab);
    showDrawer();
  };

  const onAddFundsFiat = () => {
    if (canDepositAndWithdraw) {
      onAddFunds(WalletTab.ADD_FUNDS_TO_FIAT_WALLET);
    } else {
      setShowCreateFiatWallet(true);
    }
  };

  const paymentMethods = {
    [WalletPaymentMethod.ETH_WALLET]: {
      label: <EthWallet />,
      disabled: !acceptEthWallet,
      value: WalletPaymentMethod.ETH_WALLET,
      referenceCurrency: SupportedCurrency.WEI,
      helper: (
        <>
          {insufficientFundsInEthWallet && (
            <Helper
              diffAmount={formatWei(
                diffInWeiForEthWallet!.toString(),
                undefined,
                {
                  maximumFractionDigits: 4,
                }
              )}
              onClick={() => onAddFunds(WalletTab.ADD_FUNDS_TO_ETH_WALLET)}
            />
          )}
          {!acceptEthWallet && (
            <WarningRoot>
              <Warning>
                <FontAwesomeIcon icon={faCircleInfo} />
                <Text14>
                  <FormattedMessage
                    id="NewOfferBuilder.TradePaymentMethods.cantAcceptETH"
                    defaultMessage="<b>{nickname}</b> can't accept ETH."
                    values={{ b: Bold, nickname: to.nickname }}
                  />
                </Text14>
              </Warning>
            </WarningRoot>
          )}
        </>
      ),
    },
    ...(showFiatWallet
      ? {
          [WalletPaymentMethod.FIAT_WALLET]: {
            label: <FiatWallet />,
            value: WalletPaymentMethod.FIAT_WALLET,
            referenceCurrency: currencyCode as SupportedCurrency,
            helper: insufficientFundsInFiatWallet &&
              diffInFiatCentsForFiatWallet && (
                <Helper
                  diffAmount={formatNumber(diffInFiatCentsForFiatWallet / 100, {
                    style: 'currency',
                    currency: currencyCode,
                  })}
                  onClick={onAddFundsFiat}
                />
              ),
          },
        }
      : {}),
  };

  const paymentOptions = [
    ...(showEthWallet ? [paymentMethods[WalletPaymentMethod.ETH_WALLET]] : []),
    ...((useCashWallet && [paymentMethods[WalletPaymentMethod.FIAT_WALLET]]) ||
      []),
  ];

  const disabled = paymentOptions.length <= 1;

  return (
    <Wrapper>
      <Dropdown
        disabled={disabled}
        fullWidth
        align="right"
        gap={8}
        onOpen={() => setExpanded(true)}
        onClose={() => setExpanded(false)}
        label={
          <Frame disabled={disabled} disableDebounce disableRipple>
            <Row>
              <Selected>
                {paymentMethods[selectedPaymentMethod]?.label}
              </Selected>
              {!disabled && <StyledChevronRightBold expanded={expanded} />}
            </Row>
          </Frame>
        }
      >
        {({ closeDropdown }) => (
          <RadioGroup
            options={paymentOptions}
            value={paymentMethods[selectedPaymentMethod]?.value}
            name="select-trade-payment-method"
            onChange={(value: string) => {
              const method = paymentMethods[value as WalletPaymentMethod];

              if (method) {
                dispatch(
                  setCurrencyAndPaymentMethod({
                    referenceCurrency: method.referenceCurrency,
                    paymentMethod: method.value,
                  })
                );
                closeDropdown();
              }
            }}
          />
        )}
      </Dropdown>
      {paymentMethods[selectedPaymentMethod]?.helper}
      {showCreateFiatWallet && (
        <CreateFiatWalletWithInterstitialModal
          onClose={() => setShowCreateFiatWallet(false)}
          statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
          onDecline={() => setShowCreateFiatWallet(false)}
          mode={InterstitialContextModalMode.DEPOSIT}
          canDismissAfterActivation={false}
        />
      )}
    </Wrapper>
  );
};

TradePaymentMethods.fragments = {
  publicUserInfoInterface: gql`
    fragment TradePaymentMethods_publicUserInfoInterface on PublicUserInfoInterface {
      id
      slug
      nickname
      profile {
        id
        enabledWallets
      }
    }
  ` as TypedDocumentNode<TradePaymentMethods_publicUserInfoInterface>,
};
