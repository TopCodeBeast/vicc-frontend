import { FormattedMessage } from 'react-intl';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';

import U23EligibleIcon from '@football/components/so5/CardProperties/U23EligibleIcon';

const U23Eligible = () => {
  return (
    <Tooltip
      title={
        <strong>
          <FormattedMessage
            id="U23Eligible.title"
            defaultMessage="U23 Eligible"
          />
        </strong>
      }
    >
      <U23EligibleIcon />
    </Tooltip>
  );
};

export default U23Eligible;
