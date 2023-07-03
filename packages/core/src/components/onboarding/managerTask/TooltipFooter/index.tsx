import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text14 } from '@core/atoms/typography';

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--unit);
`;

type Props = {
  value: number;
  total: number;
  onClick: () => void;
  buttonLabel: MessageDescriptor;
};
const TooltipFooter = ({ value, total, onClick, buttonLabel }: Props) => {
  return (
    <Footer>
      <Text14 color="var(--c-neutral-500)">
        <FormattedMessage
          id="TooltipContent.steps"
          defaultMessage="{value} of {total}"
          values={{
            value,
            total,
          }}
        />
      </Text14>
      <Button small color="blue" onClick={onClick}>
        <FormattedMessage {...buttonLabel} />
      </Button>
    </Footer>
  );
};

export default TooltipFooter;
