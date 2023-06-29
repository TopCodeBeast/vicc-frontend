import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Dialog from '@core/atoms/layout/Dialog';
import { Title4 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

export const messages = defineMessages({
  cancelWithdraw: {
    id: 'WithdrawCancelDialog.cancelWithdraw',
    defaultMessage: 'Are you sure you want to cancel the ongoing withdrawal?',
  },
});

const Content = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: var(--double-unit);
`;
const Buttons = styled.div`
  display: flex;
  width: 100%;
  gap: var(--double-unit);
  & button {
    flex: 1;
  }
`;

export const WithdrawCancelDialog = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose} hideCloseButton>
      <Content>
        <Title4>
          <FormattedMessage {...messages.cancelWithdraw} />
        </Title4>
        <Buttons>
          <Button medium onClick={onClose} color="gray" type="submit">
            <FormattedMessage {...glossary.no} />
          </Button>
          <Button onClick={onConfirm} medium color="blue" type="submit">
            <FormattedMessage {...glossary.yes} />
          </Button>
        </Buttons>
      </Content>
    </Dialog>
  );
};

export default WithdrawCancelDialog;
