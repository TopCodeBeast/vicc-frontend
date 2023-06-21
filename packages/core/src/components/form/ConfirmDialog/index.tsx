import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button, { Props as ButtonProps } from '@core/atoms/buttons/Button';
import Dialog from '@core/atoms/layout/Dialog';
import { Text16 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

type Props = {
  onConfirm: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  message?: ReactNode;
  cancelCta?: ReactNode;
  cta?: ReactNode;
  ctaProps?: ButtonProps;
  open: boolean;
  onClose: () => void;
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Message = styled(Text16)`
  text-align: center;
  font-weight: normal;
`;
const Actions = styled.div`
  display: flex;
  margin-top: 20px;
  & > * {
    width: 100%;
  }
  & > *:first-child {
    margin-right: 20px;
  }
`;

export const ConfirmDialog = ({
  title,
  subtitle,
  message,
  onConfirm,
  cancelCta,
  cta,
  ctaProps,
  open,
  onClose,
}: Props) => {
  const confirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} hideCloseButton title={title}>
      <Content>
        {subtitle}
        {message || (
          <Message>
            <FormattedMessage
              id="ConfirmDialog.message"
              defaultMessage="Are you sure?"
            />
          </Message>
        )}
      </Content>
      <Actions>
        <Button medium onClick={onClose} color="darkGray">
          {cancelCta || <FormattedMessage {...glossary.close} />}
        </Button>
        <Button color="blue" medium onClick={confirm} {...ctaProps}>
          {cta || (
            <FormattedMessage
              id="ConfirmDialog.confirm"
              defaultMessage="Confirm"
            />
          )}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ConfirmDialog;
