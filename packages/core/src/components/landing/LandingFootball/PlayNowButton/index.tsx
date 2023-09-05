import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import Button, { Props } from '@core/atoms/buttons/Button';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useEvents from '@core/lib/events/useEvents';
import { glossary } from '@core/lib/glossary';

const PlayNowButton = (props: Props) => {
  const { up: isTablet } = useScreenSize('tablet');
  const track = useEvents();
  const navigate = useNavigate();
  const { to, ...rest } = props;

  const trackClickPlayNow = useCallback(() => {
    track('Click Play Now', {
      sport: Sport.CRICKET,
    });
  }, [track]);

  const onClick = () => {
    trackClickPlayNow();
    if (to) navigate(to);
  };

  return (
    <Button color="black" medium={!isTablet} onClick={onClick} {...rest}>
      <FormattedMessage {...glossary.playNow} />
    </Button>
  );
};

export default PlayNowButton;
