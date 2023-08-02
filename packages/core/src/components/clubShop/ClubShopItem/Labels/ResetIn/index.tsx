import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@core/atoms/typography';
import { useTimeLeft } from '@core/hooks/useTimeLeft';

const Text = styled(Caption)`
  display: inline-flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = { myLimitResetAt: string };

export const ResetIn = ({ myLimitResetAt }: Props) => {
  const time = parseISO(myLimitResetAt);
  const { message } = useTimeLeft(time);
  return (
    <Text color="var(--c-neutral-600)">
      <FontAwesomeIcon icon={faClock} />
      <FormattedMessage
        id="ClubShop.Item.Label.Reset"
        defaultMessage="Reset in {remaining}"
        values={{ remaining: message }}
      />
    </Text>
  );
};
