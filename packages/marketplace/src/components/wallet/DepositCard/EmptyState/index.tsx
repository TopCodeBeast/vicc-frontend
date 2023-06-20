import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title4 } from '@sorare/core/src/atoms/typography';
import Cards from '@sorare/core/src/atoms/ui/Cards';
import { glossary } from '@sorare/core/src/lib/glossary';

const messages = defineMessages({
  title: {
    id: 'DepositCard.EmptyState.title',
    defaultMessage: 'No Cards found',
  },
  desc: {
    id: 'DepositCard.EmptyState.details',
    defaultMessage:
      'We couldn’t find any Card linked to your Ethereum account ({accountAddress}). Please make sure you have a Card to deposit and try again.',
  },
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const Desc = styled(Text16)`
  text-align: center;
`;

type Props = {
  closeDialog: () => void;
  accountAddress?: string;
};

const EmptyState = ({ closeDialog, accountAddress }: Props) => {
  return (
    <Container>
      <Cards />
      <Title4>
        <FormattedMessage {...messages.title} />
      </Title4>
      <Desc>
        <FormattedMessage {...messages.desc} values={{ accountAddress }} />
      </Desc>
      <Button fullWidth medium color="darkGray" onClick={closeDialog}>
        <FormattedMessage {...glossary.close} />
      </Button>
    </Container>
  );
};

export default EmptyState;
