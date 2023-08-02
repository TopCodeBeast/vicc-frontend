import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text16, Title4 } from '@core/atoms/typography';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit);
  align-items: center;
  text-align: center;
`;

const CheckContainer = styled.div`
  align-self: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--c-green-600);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const messages = defineMessages({
  title: {
    id: 'DepositAccepted.title',
    defaultMessage: 'Deposit accepted!',
  },
  content: {
    id: 'DepositAccepted.content',
    defaultMessage: '{amount} has been added to your Cash balance.',
  },
  caption: {
    id: 'DepositAccepted.caption',
    defaultMessage:
      'All deposits will appear on your statement as Mangopay.com.',
  },
});

type Props = {
  amount: number;
};

export const DepositAccepted = ({ amount }: Props) => {
  const { formatNumber } = useIntlContext();
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();

  return (
    <Wrapper>
      <CheckContainer>
        <FontAwesomeIcon icon={faCheck} size="2x" />
      </CheckContainer>
      <Title4>
        <FormattedMessage {...messages.title} />
      </Title4>
      <Text16>
        <FormattedMessage
          {...messages.content}
          values={{
            amount: formatNumber(amount, { style: 'currency', currency: code }),
          }}
        />
      </Text16>
      <Caption color="var(--c-neutral-600)">
        <FormattedMessage {...messages.caption} />
      </Caption>
    </Wrapper>
  );
};
