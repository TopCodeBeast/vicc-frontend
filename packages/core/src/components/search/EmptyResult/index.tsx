import { FormattedMessage, defineMessages } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { Text16 } from '@core/atoms/typography';

const messages = defineMessages({
  [Sport.FOOTBALL]: {
    id: 'EmptyResult.FOOTBALL',
    defaultMessage: 'No result in Football',
  },
  [Sport.BASEBALL]: {
    id: 'EmptyResult.BASEBALL',
    defaultMessage: 'No result in MLB',
  },
  [Sport.NBA]: {
    id: 'EmptyResult.NBA',
    defaultMessage: 'No result in NBA',
  },
});

const EmptyResult = ({ sport }: { sport: Sport }) => {
  return (
    <div>
      <Button disabled medium color="darkGray">
        <Text16 bold>
          <FormattedMessage {...messages[sport]} />
        </Text16>
      </Button>
    </div>
  );
};

export default EmptyResult;
