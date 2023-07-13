import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text16, Title5 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

type Props = {
  onClose: () => void;
  codes: string[];
};

const messages = defineMessages({
  subtitle: {
    id: 'Settings.recoveryCodesDialog.subtitle',
    defaultMessage: 'Please save those backup codes!',
  },
  description: {
    id: 'Settings.recoveryCodesDialog.description',
    defaultMessage:
      'Those codes will allow you to enter your account if you lose your auth app. Each code can only be used once! Any previously generated codes no longer work.',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  gap: var(--double-unit);
`;

const CodeBox = styled.div`
  width: 100%;
  background-color: var(--c-neutral-300);
  padding: 0 var(--double-unit);
`;
const CodeList = styled.ul`
  columns: 2;
  padding-left: 0;
  list-style-type: none;
`;

export const RecoveryCodesDialogContent = ({ codes, onClose }: Props) => {
  return (
    <Wrapper>
      <Title5 color="var(--c-neutral-1000)">
        <FormattedMessage {...messages.subtitle} />
      </Title5>
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage {...messages.description} />
      </Text16>
      <CodeBox>
        <CodeList>
          {codes.map(code => (
            <li key={code}>
              <code>{code}</code>
            </li>
          ))}
        </CodeList>
      </CodeBox>
      <Button color="blue" small onClick={() => onClose()}>
        <FormattedMessage {...glossary.done} />
      </Button>
    </Wrapper>
  );
};

export default RecoveryCodesDialogContent;
