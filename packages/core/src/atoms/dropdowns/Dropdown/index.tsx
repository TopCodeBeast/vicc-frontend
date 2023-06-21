import { ClickAwayListener } from '@material-ui/core';
import classnames from 'classnames';
import {
  FC,
  FormEventHandler,
  ReactElement,
  ReactNode,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useKey } from 'react-use';
import styled from 'styled-components';

import { Portal } from '@core/atoms/layout/Portal';
import { Text16 } from '@core/atoms/typography';
import useFocusTrap from '@core/hooks/useFocusTrap';
import { clamp } from '@core/lib/math';
import { theme } from '@core/style/theme';

const drawerThreshold = theme.breakpoints.values.laptop;

const SelectWrapper = styled.div`
  display: inline-flex;

  &.fullWidth {
    width: 100%;
  }
`;
const Overlay = styled.button`
  position: fixed;
  z-index: ${theme.zIndex.tooltip};
  inset: 0;
  background: rgba(var(--c-static-rgb-neutral-1000), 0.7);
  content: '';

  @media (min-width: ${drawerThreshold}px) {
    display: none;
  }
`;
const DropdownContent = styled.form`
  position: fixed;
  z-index: ${theme.zIndex.tooltip};
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  background-color: var(--c-neutral-100);
  box-shadow: ${theme.boxShadow[200]};
  border-radius: ${theme.radius.sm}px ${theme.radius.sm}px 0 0;
  pointer-events: none;
  opacity: 0;
  transform: translateY(50%);
  visibility: hidden;
  transition: 0.15s ease transform, 0.15s ease opacity;
  overflow: auto;
  &.dark-theme {
    background-color: var(--c-neutral-300);
  }
  &.open {
    pointer-events: auto;
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
  @media (min-width: ${drawerThreshold}px) {
    overscroll-behavior: contain;
    border-radius: ${theme.radius.sm}px;
    transform: translateY(-5%);
    min-width: max-content;
    &.open {
      transform: translateY(0);
    }
    &.fullWidth {
      width: 100%;
      min-width: 0;
    }
  }
`;

export const DropdownOptionLabel = styled(Text16).attrs({ as: 'label' })`
  display: flex;
  padding: var(--unit) var(--quadruple-unit) var(--unit) var(--double-unit);
  color: var(--c-neutral-600);
  &:hover,
  &:focus,
  &:focus-within,
  &.selected {
    background: var(--c-neutral-300);
    cursor: pointer;
    .dark-theme & {
      background: var(--c-neutral-400);
    }
  }
`;

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

const ButtonWrapper = styled(({ component, ...props }) =>
  cloneElement(component, { ...props })
)`
  position: relative;
  &::before {
    pointer-events: none;
    opacity: 0;
  }
  &.open {
    &.triggerOnHover::before {
      @media (min-width: ${drawerThreshold}px) {
        display: none;
      }
    }
  }
`;

export type Props = {
  children: ReactNode | FC<{ closeDropdown: () => void }>;
  label: ReactElement;
  gap?: 0 | 4 | 8 | 16;
  onChange?: FormEventHandler<HTMLFormElement>;
  triggerOnHover?: boolean;
  closeOnChange?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  preventDefault?: boolean;
  fullWidth?: boolean;
  align?: 'left' | 'right';
  darkTheme?: boolean;
  lightTheme?: boolean;
  disabled?: boolean;
};

export const THRESHOLD = 10;

const Dropdown = ({
  children,
  label,
  gap = 0,
  onChange,
  triggerOnHover = false,
  closeOnChange = false,
  onClose = () => {},
  onOpen = () => {},
  preventDefault,
  fullWidth,
  align = 'left',
  darkTheme,
  lightTheme,
  disabled,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const dropdownContentRef = useFocusTrap(open);
  const [coordinates, setCoordinates] = useState<
    Record<string, string | number>
  >({
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto',
  });
  const [maxHeight, setMaxHeight] = useState('100%');
  const [maxWidth, setMaxWidth] = useState('auto');

  const closeDropdown = useCallback(() => {
    onClose();
    setOpen(false);
  }, [onClose]);

  const openDropdown = useCallback(() => {
    onOpen();
    setOpen(true);
  }, [onOpen]);

  useKey('Escape', () => open && closeDropdown(), undefined, [open]);
  useKey(
    'Enter',
    e => {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        const currentFocus =
          dropdownContentRef.current.querySelector('*:focus');
        if (currentFocus) {
          currentFocus.click();
        }
      }
    },
    undefined,
    [open]
  );
  const mouseLeave = () => {
    if (!isTouchDevice() && triggerOnHover) {
      closeDropdown();
    }
  };
  const mouseEnter = () => {
    if (!isTouchDevice() && triggerOnHover) {
      openDropdown();
    }
  };

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // SSR mode, skip this
      return () => {};
    }

    const buttonCurrentRef = wrapperRef.current;
    const dropdownCurrentRef = dropdownContentRef.current;
    // Intersection observer here allows to retrieve up to date position
    // without forcing a layout reflow
    // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const { offsetWidth, offsetHeight } = dropdownCurrentRef;
          const { top, height, left, right } = entry.boundingClientRect;
          const { width: rootWidth, height: rootHeight } = entry.rootBounds || {
            width: 0,
            height: 0,
          };
          if (rootWidth < drawerThreshold) {
            setCoordinates({
              top: 'auto',
              right: 0,
              bottom: 0,
              left: 0,
            });
            setMaxHeight('50%');
          } else {
            const canBeBottom =
              top + height + offsetHeight + gap + THRESHOLD < rootHeight;
            const canBeTop = offsetHeight + gap < top;

            const bottomPosition = Math.max(THRESHOLD, top + height + gap);

            const topPosition = top - offsetHeight - gap;

            let dropdownPosition = bottomPosition;
            if (!canBeBottom) {
              if (canBeTop) {
                dropdownPosition = topPosition;
              } else {
                // we are in a small height window here (or the dropdown content is long),
                // let's try to position the dropdown to where there is max space
                // eslint-disable-next-line no-lonely-if
                if (top > offsetHeight - top) {
                  const newMaxHeight = top - gap - THRESHOLD;
                  dropdownPosition = top - newMaxHeight - gap;
                  setMaxHeight(`${newMaxHeight}px`);
                } else {
                  dropdownPosition = bottomPosition;
                  setMaxHeight(
                    `${rootHeight - top - height - gap - THRESHOLD}px`
                  );
                }
              }
            }

            if (fullWidth) {
              setCoordinates({
                top: `${dropdownPosition}px`,
                left,
                bottom: 'auto',
                right,
              });
              setMaxWidth(`${right - left}px`);
            } else {
              setCoordinates({
                top: `${dropdownPosition}px`,
                left: `${clamp(
                  align === 'left' ? left : right - offsetWidth,
                  THRESHOLD,
                  rootWidth - offsetWidth - THRESHOLD
                )}px`,
                bottom: 'auto',
                right: 'auto',
              });
              setMaxWidth('auto');
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );
    if (buttonCurrentRef) {
      observer.observe(buttonCurrentRef);
    }
    return () => {
      if (buttonCurrentRef) {
        observer.unobserve(buttonCurrentRef);
      }
    };
  }, [open, dropdownContentRef, wrapperRef, gap, align, fullWidth]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    window.addEventListener('scroll', closeDropdown);
    return () => {
      window.removeEventListener('scroll', closeDropdown);
    };
  }, [open, closeDropdown]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open) {
          closeDropdown();
        }
      }}
    >
      <SelectWrapper ref={wrapperRef} className={classnames({ fullWidth })}>
        <ButtonWrapper
          disabled={disabled}
          component={label}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            // TODO: Check with Guillaume B. if we can use event.preventDefault(); as default. Introduced for priceHistory feature where button is inside a link.
            if (preventDefault) {
              event.preventDefault();
            }
            if (open) {
              closeDropdown();
            } else {
              openDropdown();
            }
          }}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          className={classnames(label.props.className, {
            triggerOnHover: triggerOnHover && !isTouchDevice(),
            open,
          })}
        />
        <Portal id="dropdown">
          {open && (
            <Overlay
              type="button"
              onClick={() => {
                closeDropdown();
              }}
            />
          )}
          <DropdownContent
            style={{ ...coordinates, maxHeight, maxWidth }}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            className={classnames({
              open,
              'dark-theme': darkTheme,
              'light-theme': lightTheme,
              fullWidth,
            })}
            ref={dropdownContentRef}
            onChange={e => {
              if (onChange) {
                onChange(e);
              }
              if (closeOnChange) {
                closeDropdown();
              }
            }}
          >
            {typeof children === 'function'
              ? children({ closeDropdown })
              : children}
          </DropdownContent>
        </Portal>
      </SelectWrapper>
    </ClickAwayListener>
  );
};

export default Dropdown;
