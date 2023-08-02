import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text16, Title3 } from '@core/atoms/typography';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';
import { refusedReasonsMessages } from '@core/lib/mangopay';

import { LEARN_MORE_ABOUT_DOCUMENT_CHECK } from '../externalLinks';
import { CreateFiatWalletSteps } from '../type';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const StyledButtonBase = styled.a`
  color: var(--c-link);
  text-decoration: underline;
`;

type Props = {
  setStep: (step: CreateFiatWalletSteps) => void;
};

export const HandleIdReviewError = ({ setStep }: Props) => {
  const { refusedReason } = useFiatBalance();

  return (
    <Content>
      <Title3>
        <FormattedMessage
          id="createFiatWallet.handleIdReviewError.title"
          defaultMessage="Let’s try again"
        />
      </Title3>
      <Text16>
        {refusedReason && (
          <FormattedMessage {...refusedReasonsMessages[refusedReason]} />
        )}
      </Text16>
      <Text16 bold>
        <StyledButtonBase
          href={LEARN_MORE_ABOUT_DOCUMENT_CHECK}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage
            id="createFiatWallet.handleIdReviewError.learnHowIdentityVerificationWorks"
            defaultMessage="Learn how identity verification works."
          />
        </StyledButtonBase>
      </Text16>
      <Button
        color="blue"
        medium
        onClick={() => setStep(CreateFiatWalletSteps.CHOOSE_DOCUMENT)}
      >
        <FormattedMessage
          id="createFiatWallet.handleIdReviewError.button"
          defaultMessage="Resubmit ID"
        />
      </Button>
    </Content>
  );
};
