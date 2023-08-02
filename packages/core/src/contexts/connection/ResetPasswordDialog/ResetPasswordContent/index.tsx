import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text16, Title3 } from '@core/atoms/typography';
import { useConnectionContext } from '@core/contexts/connection';
import WalletPlaceholder from '@core/contexts/wallet/Placeholder';
import { glossary } from '@core/lib/glossary';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Center = styled.div`
  text-align: center;
`;

const Frame = styled(WalletPlaceholder)`
  margin-top: 10px;
  position: relative;
  top: 0;
  height: 200px;
`;

type Props = {
  hasSubmitted: boolean;
};

export const ResetPasswordContent = ({ hasSubmitted }: Props) => {
  const { signIn } = useConnectionContext();
  const [, setSearchParams] = useSearchParams();

  if (hasSubmitted) {
    return (
      <Content>
        <Center>
          <Title3>
            <FormattedMessage
              id="ResetPasswordDialog.submitted.title"
              defaultMessage="You’re all set"
            />
          </Title3>
        </Center>
        <Center>
          <Text16 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="ResetPasswordDialog.submitted.desc"
              defaultMessage="Your new password has been saved. You can try to sign in using your new password."
            />
          </Text16>
        </Center>
        <Button
          medium
          color="blue"
          onClick={() => {
            signIn();
            setSearchParams({});
          }}
        >
          <FormattedMessage {...glossary.signin} />
        </Button>
      </Content>
    );
  }
  return (
    <Content>
      <Title3>
        <FormattedMessage
          id="ResetPasswordDialog.title"
          defaultMessage="Create your new password"
        />
      </Title3>
      <Text16 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="ResetPasswordDialog.desc"
          defaultMessage="Enter a new password to secure your Sorare account. It must be at least six characters long."
        />
      </Text16>
      <Text16 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="ResetPasswordDialog.helper"
          defaultMessage="Setting a new password will require you to recover your Sorare wallet the next time you log in."
        />
      </Text16>
      <Frame />
    </Content>
  );
};
