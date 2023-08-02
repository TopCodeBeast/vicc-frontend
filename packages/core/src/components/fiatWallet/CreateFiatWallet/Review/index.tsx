import { faClock } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text14, Title3 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--double-unit);
  height: 100%;
`;

const Actions = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
export const Review = ({ onClick }: { onClick: () => void }) => {
  return (
    <Content>
      <FontAwesomeIcon size="2xl" icon={faClock} />
      <Title3>
        <FormattedMessage
          id="Review.title"
          defaultMessage="We’re reviewing your ID"
        />
      </Title3>
      <Text14>
        <FormattedMessage
          id="Review.description"
          defaultMessage="It usually takes 5 - 10 minutes but sometimes can take up to 24 hours."
        />
      </Text14>
      <Text14>
        <FormattedMessage
          id="Review.descriptionNotify"
          defaultMessage="We’ll notify you once we validate your ID. After that, you will have access to cash deposits, cash withdrawals, and cash rewards."
        />
      </Text14>
      <Text14>
        <FormattedMessage
          id="Review.meantime"
          defaultMessage="In the meantime, you can pick up right where you left off."
        />
      </Text14>
      <Actions>
        <Button fullWidth medium color="blue" onClick={onClick}>
          <FormattedMessage {...glossary.done} />
        </Button>
      </Actions>
    </Content>
  );
};

export default Review;
