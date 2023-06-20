import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Text18, Title2 } from '@sorare/core/src/atoms/typography';

import { StaticCashBalance } from '../StaticCashBalance';
import { WalletSetupTab } from '../type';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--quadruple-unit);
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--half-unit);
  text-align: center;
`;

const CenteredText16 = styled(Text16)`
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  width: 100%;
`;

type Props = {
  setWalletSetupTab: (tab: WalletSetupTab) => void;
  onClose: () => void;
};

export const Home = ({ setWalletSetupTab, onClose }: Props) => {
  return (
    <Wrapper>
      <Title>
        <Text18>
          <FormattedMessage
            id="walletSetup.home.title"
            defaultMessage="New in wallet"
          />
        </Text18>
        <Title2>
          <FormattedMessage
            id="walletSetup.home.cashBalance"
            defaultMessage="Cash balance"
          />
        </Title2>
      </Title>
      <StaticCashBalance />
      <CenteredText16 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="walletSetup.home.description"
          defaultMessage="Receive cash rewards, and buy and sell player cards in your local currency. Seamlessly deposit and withdraw directly from your bank."
        />
      </CenteredText16>
      <Actions>
        <Button
          color="blue"
          medium
          fullWidth
          onClick={() => setWalletSetupTab(WalletSetupTab.WHATS_NEW)}
        >
          <FormattedMessage
            id="walletSetup.home.continue"
            defaultMessage="Set up cash balance"
          />
        </Button>
        <Button color="white" medium fullWidth onClick={onClose}>
          <FormattedMessage
            id="walletSetup.home.doItLater"
            defaultMessage="I’ll do it later"
          />
        </Button>
      </Actions>
    </Wrapper>
  );
};
