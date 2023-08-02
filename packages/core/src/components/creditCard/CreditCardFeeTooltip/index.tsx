import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

import Tooltip from '@core/atoms/tooltip/Tooltip';

export const CreditCardFeeTooltip = () => {
  return (
    <Tooltip
      enterTouchDelay={0}
      interactive
      placement="top"
      title={
        <FormattedMessage
          id="CreditCardFeeTooltip.feeTooltip"
          defaultMessage="This fee helps cover the costs associated with credit card processing"
        />
      }
    >
      <FontAwesomeIcon color="var(--c-neutral-600)" icon={faInfoCircle} />
    </Tooltip>
  );
};
export default CreditCardFeeTooltip;
