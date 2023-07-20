import { memo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';

import CaptainToggle from '@football/components/so5/ComposeTeam/responsive/CaptainToggle';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--unit) var(--triple-unit) var(--triple-unit) var(--triple-unit);
  text-align: center;
`;
const CaptainWrapper = styled.div`
  position: relative;
`;
const Message = styled(Text16)`
  margin-top: var(--unit);
  color: var(--c-neutral-600);
`;

type Props = {
  open: boolean;
  message: string;
  onClose: () => void;
};
const Component = ({ open, message, onClose }: Props) => {
  const [active, toggleActive] = useToggle(false);

  useEffect(() => {
    if (!open) return () => {};
    const timeout = setTimeout(() => {
      toggleActive();
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [toggleActive, open]);

  if (!open) {
    return null;
  }

  return (
    <Dialog
      darkTheme
      open
      maxWidth="xs"
      onClose={onClose}
      body={
        <Wrapper>
          <CaptainWrapper>
            <CaptainToggle
              onClick={() => {}}
              active={active}
              disablePositioning
            />
          </CaptainWrapper>
          <Title3>
            <FormattedMessage
              id="CaptainDialog.title"
              defaultMessage="Select your Captain"
            />
          </Title3>
          <Message>{message}</Message>
          <Button color="blue" medium fullWidth onClick={onClose}>
            <FormattedMessage {...glossary.ok} />
          </Button>
        </Wrapper>
      }
    />
  );
};

export const CaptainDialog = memo(Component);

export default CaptainDialog;
