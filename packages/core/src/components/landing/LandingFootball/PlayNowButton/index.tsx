import { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Sport } from '@core/__generated__/globalTypes';
import Button, { Props } from '@core/atoms/buttons/Button';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useEvents from '@core/lib/events/useEvents';

const messages = defineMessages({
  playNow: {
    id: 'LandingContent.playNow',
    defaultMessage: 'Play now',
  },
});

const PlayNowButton = (props: Props) => {
  const { up: isTablet } = useScreenSize('tablet');
  const track = useEvents();
  const navigate = useNavigate();
  const { to, ...rest } = props;

  const trackClickPlayNow = useCallback(() => {
    track('Click Play Now', {
      sport: Sport.FOOTBALL,
    });
  }, [track]);

  const onClick = () => {
    trackClickPlayNow();
    if (to) navigate(to);
  };

  return (
    <Button color="black" medium={!isTablet} onClick={onClick} {...rest}>
      <FormattedMessage {...messages.playNow} />
    </Button>
  );
};

export default PlayNowButton;
