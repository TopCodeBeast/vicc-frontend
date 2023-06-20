import { Link } from 'react-router-dom';

import { Sport } from '__generated__/globalTypes';
import Button, { Color } from '@sorare/core/src/atoms/buttons/Button';
import useEvents from '@sorare/core/src/lib/events/useEvents';

type Props = {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  tabIndex?: number;
  medium?: boolean;
  color?: Color;
  sport?: Sport;
};

const PlayNowButton = ({
  children,
  className,
  to,
  sport,
  onClick,
  tabIndex,
  medium = true,
  color = 'white',
}: Props) => {
  const track = useEvents();

  const args = to ? { to, component: Link } : {};
  return (
    <Button
      color={color}
      medium={medium}
      className={className}
      tabIndex={tabIndex}
      onClick={() => {
        if (sport) {
          track('Click Play Now', {
            sport,
          });
        }
        if (!to) onClick?.();
      }}
      {...args}
    >
      {children}
    </Button>
  );
};

export default PlayNowButton;
