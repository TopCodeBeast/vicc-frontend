import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Title5 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useToggle from '@sorare/core/src/hooks/useToggle';

import Container from './Container';

const messages = defineMessages({
  cta: {
    id: 'DepositCard.cta',
    defaultMessage: 'Deposit Cards',
  },
  title: {
    id: 'DepositCard.dialog.title',
    defaultMessage: 'Deposit Cards',
  },
});

const DepositCard = () => {
  const [open, toggleOpen] = useToggle(false);
  const { up: isTablet } = useScreenSize('tablet');

  return (
    <>
      <Button onClick={toggleOpen} color="darkGray" small>
        <FormattedMessage {...messages.cta} />
      </Button>
      {open && (
        <Dialog
          open
          headerCentered
          title={
            <Title5>
              <FormattedMessage {...messages.title} />
            </Title5>
          }
          onClose={toggleOpen}
          fullScreen={!isTablet}
        >
          <Container closeDialog={toggleOpen} />
        </Dialog>
      )}
    </>
  );
};

export default DepositCard;
