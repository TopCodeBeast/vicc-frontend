import { memo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';

import CaptainToggle from '@football/components/so5/ComposeTeam/responsive/CaptainToggle';

type Props = {
  open: boolean;
  message: string;
  onClose: () => void;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  margin: calc(5 * var(--unit));
  text-align: center;
`;

const CaptainWrapper = styled.div`
  position: relative;
`;

const Message = styled(Text16)`
  margin-top: var(--unit);
  color: var(--c-neutral-600);
`;

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
    <Dialog fullWidth={false} maxWidth="xs" open onClose={onClose} darkTheme>
      <Wrapper>
        <CaptainWrapper>
          <CaptainToggle
            onClick={() => {}}
            active={active}
            disablePositioning
          />
        </CaptainWrapper>
        <div>
          <Title3>
            <FormattedMessage
              id="CaptainDialog.title"
              defaultMessage="Select your Captain"
            />
          </Title3>
          <Message>{message}</Message>
        </div>
        <Button color="blue" medium onClick={onClose}>
          <FormattedMessage {...glossary.ok} />
        </Button>
      </Wrapper>
    </Dialog>
  );
};

export const CaptainDialog = memo(Component);

export default CaptainDialog;
