import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title5 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
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

const CenteredTitle5 = styled(Title5)`
  text-align: center;
`;
const Body = styled.div`
  padding: var(--triple-unit);
`;

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
          onClose={toggleOpen}
          maxWidth="sm"
          fullScreen={!isTablet}
          title={
            <CenteredTitle5>
              <FormattedMessage {...messages.title} />
            </CenteredTitle5>
          }
          body={
            <Body>
              <Container closeDialog={toggleOpen} />
            </Body>
          }
        />
      )}
    </>
  );
};

export default DepositCard;
