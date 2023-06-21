import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import coinbase from '@core/assets/wallet/icon-coinbase.png';
import metamask from '@core/assets/wallet/icon-metamask.png';
import opera from '@core/assets/wallet/icon-opera.png';
import phantom from '@core/assets/wallet/icon-phantom.svg';
import portis from '@core/assets/wallet/icon-portis.png';
import trustWallet from '@core/assets/wallet/icon-trustWallet.svg';
import walletConnect from '@core/assets/wallet/icon-walletConnect.png';
import ButtonsList, { ButtonProps } from '@core/atoms/buttons/ButtonsList';
import { Text16 } from '@core/atoms/typography';
import { useWeb3Context } from '@core/contexts/web3';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import useToggle from '@core/hooks/useToggle';

const StyledImg = styled.img`
  max-width: var(--quadruple-unit);
  max-height: var(--quadruple-unit);
`;
const ButtonText = styled.div`
  text-align: center;
  width: 100%;
`;

const RecommendedWalletApp = () => {
  const {
    flags: { useSupportPhantom = false },
  } = useFeatureFlags();
  const { up: isLaptop } = useScreenSize('laptop');
  const { setupWalletConnect, setupCoinbaseWallet, setupPortis } =
    useWeb3Context();
  const [showMoreOptions, toggleShowMoreOptions] = useToggle(false);

  const encodedRedirectUrl = encodeURI(
    `${window.location.origin}?action=addFundsEth`
  );

  const METAMASK_MOBILE_APP_LINK = `https://metamask.app.link/dapp/${window.location.host}?action=addFundsEth`;
  const COINBASE_MOBILE_APP_LINK = `https://go.cb-w.com/dapp?cb_url=${encodedRedirectUrl}`;
  const TRUST_WALLET_MOBILE_APP_LINK = `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedRedirectUrl}`;

  const mobileButtons = (ButtonComponent: ButtonProps) => (
    <>
      <ButtonComponent href={METAMASK_MOBILE_APP_LINK}>
        <StyledImg alt="Metamask" src={metamask} />
        <Text16>Metamask</Text16>
      </ButtonComponent>
      <ButtonComponent href={COINBASE_MOBILE_APP_LINK}>
        <StyledImg alt="coinbase" src={coinbase} />
        <Text16>Coinbase Wallet</Text16>
      </ButtonComponent>
      <ButtonComponent href={TRUST_WALLET_MOBILE_APP_LINK}>
        <StyledImg alt="Trust Wallet" src={trustWallet} />
        <Text16>Trust Wallet</Text16>
      </ButtonComponent>
      {showMoreOptions && (
        <>
          <ButtonComponent onClick={setupPortis}>
            <StyledImg alt="portis" src={portis} />
            <Text16>Portis</Text16>
          </ButtonComponent>
          <ButtonComponent href="https://www.opera.com/fr/crypto">
            <StyledImg alt="opera" src={opera} />
            <Text16>Opera</Text16>
          </ButtonComponent>
        </>
      )}
    </>
  );

  const desktopButtons = (ButtonComponent: ButtonProps) => (
    <>
      <ButtonComponent href="https://metamask.io/">
        <StyledImg alt="Metamask" src={metamask} />
        <Text16>Metamask</Text16>
      </ButtonComponent>
      <ButtonComponent onClick={setupCoinbaseWallet}>
        <StyledImg alt="Coinbase" src={coinbase} />
        <Text16>Coinbase Wallet</Text16>
      </ButtonComponent>
      <ButtonComponent href="https://trustwallet.com/browser-extension">
        <StyledImg alt="Trust Wallet" src={trustWallet} />
        <Text16>Trust Wallet</Text16>
      </ButtonComponent>
      {useSupportPhantom && (
        <ButtonComponent href="https://phantom.app/download">
          <StyledImg alt="Phantom" src={phantom} />
          <Text16>Phantom</Text16>
        </ButtonComponent>
      )}
      {showMoreOptions && (
        <>
          <ButtonComponent onClick={setupWalletConnect}>
            <StyledImg alt="Wallet Connect" src={walletConnect} />
            <Text16>Wallet Connect</Text16>
          </ButtonComponent>
          <ButtonComponent onClick={setupPortis}>
            <StyledImg alt="portis" src={portis} />
            <Text16>Portis</Text16>
          </ButtonComponent>
          <ButtonComponent href="https://www.opera.com/fr/crypto">
            <StyledImg alt="opera" src={opera} />
            <Text16>Opera</Text16>
          </ButtonComponent>
        </>
      )}
    </>
  );

  return (
    <ButtonsList>
      {ButtonComponent => (
        <>
          {!isLaptop
            ? mobileButtons(ButtonComponent)
            : desktopButtons(ButtonComponent)}

          <ButtonComponent onClick={toggleShowMoreOptions}>
            <ButtonText>
              <Text16>
                {showMoreOptions ? (
                  <FormattedMessage
                    id="RecommendedWalletApp.collapse"
                    defaultMessage="Show less"
                  />
                ) : (
                  <FormattedMessage
                    id="RecommendedWalletApp.collapsed"
                    defaultMessage="Show more"
                  />
                )}
              </Text16>
            </ButtonText>
          </ButtonComponent>
        </>
      )}
    </ButtonsList>
  );
};

export default RecommendedWalletApp;
