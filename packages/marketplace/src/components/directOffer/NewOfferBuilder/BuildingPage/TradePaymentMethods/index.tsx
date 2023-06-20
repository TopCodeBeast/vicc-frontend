import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';
import { ChevronRightBold } from '@sorare/core/src/atoms/icons/ChevronRightBold';
import RadioGroup from '@sorare/core/src/atoms/inputs/RadioGroup';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import {
  WalletTab,
  useWalletDrawerContext,
} from '@sorare/core/src/contexts/walletDrawer';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { wallet } from '@sorare/core/src/lib/glossary';
import { toWei } from '@sorare/core/src/lib/wei';

import EthWallet from '@sorare/marketplace/src/components/buyActions/PaymentBox/Methods/EthWallet';
import FiatWallet from '@sorare/marketplace/src/components/buyActions/PaymentBox/Methods/FiatWallet';
import { WalletPaymentMethod } from '@sorare/marketplace/src/components/buyActions/PaymentProvider/types';
import useHasInsufficientFundsInWallets from '@sorare/marketplace/src/hooks/useHasInsufficientFundsInWallets';

import { setCurrencyAndPaymentMethod } from '../../actions';
import { CardDataType, StateProps } from '../../types';

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
const Row = styled(ButtonBase)`
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

const Helper = ({
  diffAmount,
  onClick,
}: {
  diffAmount: string;
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
  state: { sendEth, paymentMethod: selectedPaymentMethod },
  dispatch,
  onClose,
}: StateProps<D> & { onClose: () => void }) => {
  const {
    flags: { useNewWallet },
  } = useFeatureFlags();

  const [expanded, setExpanded] = useState(false);
  const { setCurrentTab, showDrawer } = useWalletDrawerContext();
  const { formatNumber, formatWei } = useIntlContext();
  const {
    currency: userSettingsCurrency,
    fiatCurrency: { code: currencyCode },
  } = useCurrentUserContext();
  const { convertFromWei } = useCurrencyConverters();
  const hasInsufficientFundsInWallets = useHasInsufficientFundsInWallets();
  const {
    insufficientFundsInEthWallet,
    diffInWeiForEthWallet,
    insufficientFundsInFiatWallet,
    diffInWeiForFiatWallet,
  } = hasInsufficientFundsInWallets(toWei(sendEth));

  useEffect(() => {
    if (selectedPaymentMethod === null) {
      dispatch(
        setCurrencyAndPaymentMethod({
          paymentMethod:
            userSettingsCurrency === Currency.ETH
              ? WalletPaymentMethod.ETH_WALLET
              : WalletPaymentMethod.FIAT_WALLET,
          currency: userSettingsCurrency,
        })
      );
    }
  }, [dispatch, selectedPaymentMethod, userSettingsCurrency]);

  if (!selectedPaymentMethod) return null;

  const onAddFundsClick = () => {
    onClose();
    setCurrentTab(WalletTab.ADD_FUNDS);
    showDrawer();
  };

  const paymentMethods = {
    [WalletPaymentMethod.ETH_WALLET]: {
      label: <EthWallet />,
      value: WalletPaymentMethod.ETH_WALLET,
      currency: Currency.ETH,
      helper: insufficientFundsInEthWallet && (
        <Helper
          diffAmount={formatWei(diffInWeiForEthWallet!.toString(), undefined, {
            maximumFractionDigits: 4,
          })}
          onClick={onAddFundsClick}
        />
      ),
    },
    [WalletPaymentMethod.FIAT_WALLET]: {
      label: <FiatWallet />,
      value: WalletPaymentMethod.FIAT_WALLET,
      currency: Currency.FIAT,
      helper: insufficientFundsInFiatWallet && (
        <Helper
          diffAmount={formatNumber(
            convertFromWei(diffInWeiForFiatWallet!.toString(), currencyCode),
            {
              style: 'currency',
              currency: currencyCode,
            }
          )}
          onClick={onAddFundsClick}
        />
      ),
    },
  };

  const paymentOptions = [
    paymentMethods[WalletPaymentMethod.ETH_WALLET],
    ...((useNewWallet && [paymentMethods[WalletPaymentMethod.FIAT_WALLET]]) ||
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
          <Frame disableDebounce disableRipple>
            <Row disableDebounce disableRipple>
              <Selected>{paymentMethods[selectedPaymentMethod].label}</Selected>
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
              const { currency, value: paymentMethod } =
                paymentMethods[value as WalletPaymentMethod];
              dispatch(
                setCurrencyAndPaymentMethod({
                  currency,
                  paymentMethod,
                })
              );
              closeDropdown();
            }}
          />
        )}
      </Dropdown>
      {paymentMethods[selectedPaymentMethod].helper}
    </Wrapper>
  );
};
