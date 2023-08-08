import { FormattedMessage } from 'react-intl';

import { Title6 } from '@core/atoms/typography';
import { LayoutProps } from '@core/contexts/ticker/TimeLeft';

export const TimeLeftLayout = ({ children }: LayoutProps) => {
  return (
    <Title6 color="var(--c-red-600)">
      <FormattedMessage
        id="Lobby.Upcoming.GW.timeleft"
        defaultMessage="Starts in {timeleft}"
        values={{
          timeleft: children,
        }}
      />
    </Title6>
  );
};
