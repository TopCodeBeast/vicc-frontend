import { ReactElement, useState } from 'react';
import { animated, config, useTransition } from '@react-spring/web';
import { useMountedState } from 'react-use';

export const Revealer = ({
  front,
  back,
  revealed,
  imediate = false,
  className,
}: {
  front: ReactElement;
  back: ReactElement;
  revealed: boolean;
  imediate?: boolean;
  className?: string;
}) => {
  const [initialized, setInitialized] = useState(false);
  const isMounted = useMountedState();

  const transitions = useTransition(revealed, {
    imediate,
    initial: null,
    from: { opacity: initialized ? 0 : 1, y: initialized ? -200 : 0 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -200 },
    reverse: revealed,
    exitBeforeEnter: true,
    config: config.stiff,
    onRest: () => isMounted() && setInitialized(true),
  });
  return (
    <div className={className}>
      {transitions((styles, isRevealed) => (
        <animated.div style={styles}>{isRevealed ? front : back}</animated.div>
      ))}
    </div>
  );
};
