import { Backdrop } from '@material-ui/core';
import classnames from 'classnames';
import { ReactNode, useCallback } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
  highlightOpen?: boolean;
  noBackdrop?: boolean;
  inModal?: boolean;
  backgroundColor?: string;
  background?: boolean;
  interactive?: boolean;
  onClick?: () => void;
};

const StyledBackdrop = styled(Backdrop)`
  z-index: 10;
  overscroll-behavior-y: auto;
`;

const Root = styled.div<{ interactive?: boolean }>`
  &.highlightOpen {
    position: relative;
    z-index: 11;
    display: flex;
    flex-direction: column;
    gap: var(--double-unit);
    ${({ interactive }) => (interactive ? `` : 'pointer-events: none;')}
    &.background {
      background-color: var(--c-static-100);
      padding: var(--unit) var(--double-unit);
      border-radius: 8px;
    }
    &.inModal {
      margin-top: var(--unit);
    }
  }
`;

const HighlightableWrapper = ({
  children,
  highlightOpen,
  noBackdrop,
  inModal,
  backgroundColor,
  background,
  interactive = true,
  onClick,
}: Props) => {
  const scrolledRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null) {
        if (inModal) {
          node.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        } else {
          window.scrollTo(0, node.offsetTop - 300);
        }
      }
    },
    [inModal]
  );

  const divProps = {
    onClick,
    onKeyDown: onClick,
    role: 'button',
    tabIndex: 0,
    ref: scrolledRef,
  };
  return (
    <>
      {highlightOpen && !noBackdrop && (
        <StyledBackdrop open onClick={onClick} />
      )}
      {/* We always render the wrapping div to avoid rerendering the children */}
      <Root
        {...(highlightOpen ? divProps : {})}
        interactive={interactive}
        {...(backgroundColor ? { style: { backgroundColor } } : {})}
        className={classnames({
          highlightOpen,
          background,
          inModal,
        })}
      >
        {children}
      </Root>
    </>
  );
};

export default HighlightableWrapper;
