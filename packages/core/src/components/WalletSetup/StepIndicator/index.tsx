import styled from 'styled-components';

import { WalletSetupTab } from '../type';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  margin: 0 auto;
  width: 67%;
`;

const Step = styled.div<{ enabled?: boolean }>`
  width: 50%;
  height: 2px;
  border-radius: var(--half-unit);
  background-color: ${({ enabled }) =>
    enabled ? 'var(--c-brand-600)' : 'var(--c-neutral-300)'};
`;

type Props = {
  walletSetupTab: WalletSetupTab;
};

export const StepIndicator = ({ walletSetupTab }: Props) => {
  if (walletSetupTab === WalletSetupTab.HOME) return null;
  return (
    <Wrapper>
      <Step
        enabled={[WalletSetupTab.WHATS_NEW, WalletSetupTab.SETUP].includes(
          walletSetupTab
        )}
      />
      <Step enabled={walletSetupTab === WalletSetupTab.SETUP} />
    </Wrapper>
  );
};
