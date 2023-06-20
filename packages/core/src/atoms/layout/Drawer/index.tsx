import { ReactNode, useMemo } from 'react';
import { animated, easings, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import { Portal } from '@sorare/core/src/atoms/layout/Portal';
import Backdrop from '@sorare/core/src/atoms/loader/Backdrop';
import useBodyLock from '@sorare/core/src/hooks/useBodyLock';

import { ConditionalWrapper } from '../ConditionalWrapper';

type DrawerSide = 'right' | 'left' | 'bottom' | 'top';

const Wrapper = styled(animated.aside)`
  position: fixed;
  inset: 0;
  isolation: isolate;
  /* above dialogs */
  z-index: 1500;
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
`;

export type Props = {
  children: ReactNode;
  open: boolean;
  className?: string;
  side?: DrawerSide;
  noPortal?: boolean;
  onBackdropClick?: () => void;
};

const DrawerPortal: React.FC = ({ children }) => (
  <Portal id="drawer">{children}</Portal>
);

export const Drawer = ({
  children,
  className,
  side = 'right',
  open,
  noPortal = false,
  onBackdropClick,
}: Props) => {
  const hiddenStyle = useMemo(() => {
    switch (side) {
      case 'right':
        return {
          x: '100%',
          y: '0%',
        };
      case 'left':
        return {
          x: '-100%',
          y: '0%',
        };
      case 'bottom':
        return {
          x: '0%',
          y: '100%',
        };
      case 'top':
      default:
        return {
          x: '0%',
          y: '-100%',
        };
    }
  }, [side]);
  const positionning = useMemo(() => {
    switch (side) {
      case 'right':
        return {
          left: 'unset',
        };
      case 'left':
        return {
          right: 'unset',
        };
      case 'bottom':
        return {
          top: 'unset',
        };
      case 'top':
      default:
        return {
          bottom: 'unset',
        };
    }
  }, [side]);
  useBodyLock(!!(open && onBackdropClick));

  const transitions = useTransition(open, {
    from: { ...positionning, ...hiddenStyle },
    enter: { ...positionning, x: '0%', y: '0%' },
    leave: { ...positionning, ...hiddenStyle },
    reverse: open,
    config: {
      duration: 250,
      easing: open ? easings.easeOutSine : easings.easeInSine,
    },
  });
  return (
    <ConditionalWrapper wrap={!noPortal} Wrapper={DrawerPortal}>
      <>
        {onBackdropClick && open && <Backdrop onClick={onBackdropClick} />}
        {transitions(
          (styles, isOpen) =>
            isOpen && (
              <Wrapper style={styles} className={className}>
                {children}
              </Wrapper>
            )
        )}
      </>
    </ConditionalWrapper>
  );
};
