// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  Fade as MuiFade,
  FadeProps as MuiFadeProps,
  Grow as MuiGrow,
  GrowProps as MuiGrowProps,
  Zoom as MuiZoom,
  ZoomProps as MuiZoomProps,
} from '@material-ui/core';
import { ReactNode, useEffect, useMemo } from 'react';

import useToggle from '@sorare/core/src/hooks/useToggle';

import Content from './Content';

interface TransitionProps {
  children: ReactNode;
  transition: 'fade' | 'grow' | 'zoom';
  delay?: number;
}

const Transition = ({
  transition,
  children,
  delay,
  ...rest
}: TransitionProps) => {
  const [visible, toggleVisible] = useToggle(!delay);
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (!visible && delay) {
      timeout = setTimeout(toggleVisible, delay);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [delay, toggleVisible, visible]);

  const TransitionComponent = useMemo(() => {
    if (transition === 'grow') return MuiGrow;
    if (transition === 'zoom') return MuiZoom;
    return MuiFade;
  }, [transition]);

  return (
    <TransitionComponent in={visible} {...rest}>
      <Content>{children}</Content>
    </TransitionComponent>
  );
};

interface FadeProps
  extends Omit<TransitionProps, 'transition'>,
    Omit<MuiFadeProps, 'children'> {}

export const Fade = (props: FadeProps) => (
  <Transition transition="fade" {...props} />
);

interface GrowProps
  extends Omit<TransitionProps, 'transition'>,
    Omit<MuiGrowProps, 'children'> {}

export const Grow = (props: GrowProps) => (
  <Transition transition="grow" {...props} />
);

interface ZoomProps
  extends Omit<TransitionProps, 'transition'>,
    Omit<MuiZoomProps, 'children'> {}

export const Zoom = (props: ZoomProps) => (
  <Transition transition="zoom" {...props} />
);
