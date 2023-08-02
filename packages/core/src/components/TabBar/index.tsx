import cn from 'classnames';
import qs, { ParsedQs } from 'qs';
import {
  ButtonHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';

import { Tag } from '@core/atoms/ui/Tag';
import { useBgLocation } from '@core/hooks/useBgLocation';
import { useIsInModal } from '@core/hooks/useIsInModal';
import useIsVisibleInViewport from '@core/hooks/useIsVisibleInViewport';
import usePrevious from '@core/hooks/usePrevious';
import { Link, LinkProps } from '@core/routing/Link';
import { hideScrollbar } from '@core/style/utils';

import { ScrollContainer } from './ScrollContainer';

type ActiveRef = RefObject<HTMLButtonElement>;

type ContextProps = {
  value?: string | null;
  activeRef?: ActiveRef;
  currentPathname: string;
  qsFromLocation: ParsedQs;
  onValueChange: (value?: string) => void;
  setActiveRef: (ref: ActiveRef) => void;
};

const Context = createContext<ContextProps | undefined>(undefined);

function useTabBarContext(consumerName: string) {
  const context = useContext(Context);
  if (context) return context;
  throw new Error(`\`${consumerName}\` must be used within \`AnimatedTabBar\``);
}

const Wrapper = styled.div`
  --bar-padding: var(--half-unit);
  --bar-bg-color: rgba(var(--c-rgb-neutral-1000), 0.075);
  --tab-padding-x: var(--double-unit);
  --tab-padding-y: var(--unit);
  --fg-color: var(--c-neutral-1000);
  --hover-bg-color: rgb(var(--c-rgb-neutral-1000), 0.1);
  --active-bg-color: var(--c-neutral-1000);
  --active-fg-color: var(--c-neutral-100);
  --active-badge-bg-color: var(--c-neutral-700);
  ${hideScrollbar}
  position: relative;
  isolation: isolate;
  display: inline-block;
  &.secondary {
    --fg-color: var(--c-neutral-600);
    --active-bg-color: var(--c-neutral-400);
    --active-fg-color: var(--c-neutral-1000);
    --active-badge-bg-color: var(--c-neutral-500);
  }
  &.black {
    --bar-bg-color: rgba(var(--c-static-rgb-neutral-1000), 0.075);
    --fg-color: var(--c-static-neutral-1000);
    --hover-bg-color: rgb(var(--c-static-rgb-neutral-1000), 0.1);
    --active-bg-color: var(--c-static-neutral-1000);
    --active-fg-color: var(--c-static-neutral-100);
    --active-badge-bg-color: var(--c-static-neutral-700);
  }
  &.white {
    --bar-bg-color: rgba(var(--c-static-rgb-neutral-100), 0.25);
    --fg-color: var(--c-static-neutral-100);
    --active-bg-color: var(--c-static-neutral-100);
    --active-fg-color: var(--c-static-neutral-1000);
    --active-badge-bg-color: var(--c-static-neutral-400);
  }
  &.compact {
    --tab-padding-x: var(--intermediate-unit);
    --tab-padding-y: var(--half-unit);
  }
`;

type Props = {
  children?: ReactNode;
  className?: string;
  value?: string | null;
  compact?: boolean;
  variant?: 'primary' | 'secondary' | 'black' | 'white';
  scrollContainerRef?: RefObject<HTMLElement>;
  onValueChange?: (value: string) => void;
};

function useScrollActiveIntoView(
  activeRef?: ActiveRef,
  scrollContainerRef?: RefObject<HTMLElement>
) {
  const prevActiveRef = usePrevious(activeRef);
  const activeVisible = useIsVisibleInViewport({ element: activeRef });

  const scrollIntoView = useCallback(
    (ref?: ActiveRef) => {
      const scrollContainer = scrollContainerRef?.current;
      const active = ref?.current;
      if (scrollContainer && active && !activeVisible) {
        const offset = active.offsetLeft - scrollContainer.scrollLeft;
        scrollContainer?.scrollBy?.({ left: offset, behavior: 'smooth' });
      }
    },
    [scrollContainerRef, activeVisible]
  );

  useEffect(() => {
    if (activeRef !== prevActiveRef) {
      scrollIntoView(activeRef);
    }
  }, [activeRef, prevActiveRef, scrollIntoView]);
}

function useLocationInfo() {
  const location = useLocation();
  const [ref, isInModal] = useIsInModal();
  const qsFromLocation = qs.parse(location.search, { ignoreQueryPrefix: true });
  const bgLocation = useBgLocation(true);
  const { pathname: currentPathname = '' } = isInModal ? location : bgLocation;
  return { ref, qsFromLocation, currentPathname };
}

export const Root = ({
  value: valueProp,
  variant = 'primary',
  compact,
  className,
  scrollContainerRef,
  onValueChange: onValueChangeProp,
  ...divProps
}: Props) => {
  const [value, setValue] = useState(valueProp);
  const [activeRef, setActiveRef] = useState<ActiveRef | undefined>(undefined);
  useScrollActiveIntoView(activeRef, scrollContainerRef);
  const { ref, ...location } = useLocationInfo();

  const onValueChange = useCallback(
    (change?: string) => {
      setValue(change);
      if (change !== undefined) onValueChangeProp?.(change);
    },
    [onValueChangeProp]
  );

  return (
    <Context.Provider
      value={{ value, activeRef, ...location, setActiveRef, onValueChange }}
    >
      <Wrapper
        ref={ref}
        className={cn(className, variant, { compact })}
        {...divProps}
      />
    </Context.Provider>
  );
};

export const Bar = styled.ul.attrs({
  role: 'tablist',
  'aria-orientation': 'horizontal',
})`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  margin: 0;
  padding: var(--bar-padding);
  background-color: var(--bar-bg-color);
  border-radius: var(--quadruple-unit);
`;

export const Badge = styled(Tag)`
  min-width: 1.5em;
  background-color: var(--bar-bg-color);
  color: var(--fg-color);
  &:first-child {
    margin-inline-start: calc(-1 * var(--unit));
  }
  &:last-child {
    margin-inline-end: calc(-1 * var(--unit));
  }
`;

const Button = styled.button`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
  padding: var(--tab-padding-y) var(--tab-padding-x);
  font: var(--t-bold) var(--t-16);
  color: var(--fg-color);
  text-align: center;
  border-radius: var(--triple-unit);
  scroll-snap-align: start;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease-in-out, background-color 0.1s ease-in-out;
  &:not(.active):hover,
  &:not(.active):focus {
    color: var(--fg-color);
    background-color: var(--hover-bg-color);
  }
  &.active {
    color: var(--active-fg-color);
    cursor: default;
    & ${Badge} {
      color: var(--active-fg-color);
      background-color: var(--active-badge-bg-color);
    }
  }
  &.active,
  &.disabled {
    pointer-events: none;
  }
  &.disabled {
    opacity: 0.4;
  }
`;

type TabProps = {
  value?: string;
  to?: string;
  matches?: (string | undefined | null | false)[];
} & Partial<Omit<LinkProps, 'to'> & ButtonHTMLAttributes<HTMLButtonElement>>;

function getActiveAndPath(
  currentPathname: string,
  to: string,
  qsFromLocation: ParsedQs,
  matches?: (string | undefined | null | false)[]
) {
  const { origin } = window.location;
  const { pathname = '', search } = new URL(to, origin);
  const isRelative = !to.startsWith('/');
  const itemPathname = isRelative ? pathname.replace(/^\//, '') : pathname;
  const qsFromTo = qs.parse(search || '', {
    ignoreQueryPrefix: true,
  });
  const pathMatch = matchPath(pathname, currentPathname);
  const match =
    Boolean(pathMatch) ||
    matches?.some(m => m && matchPath(m, currentPathname));
  const path =
    itemPathname +
    qs.stringify(
      Object.fromEntries(
        Object.entries({ ...qsFromLocation, ...qsFromTo }).filter(([, v]) =>
          Boolean(v)
        )
      ),
      { addQueryPrefix: true }
    );
  return [Boolean(match), path] as const;
}

export const Tab = ({
  value,
  to,
  matches,
  disabled,
  replace,
  className,
  onClick,
  ...props
}: TabProps) => {
  const {
    value: barValue,
    currentPathname,
    qsFromLocation,
    setActiveRef,
    onValueChange,
  } = useTabBarContext('Tab');
  const ref: ActiveRef = useRef(null);

  const [active, path] = useMemo((): readonly [boolean, string?] => {
    if (!to) return [value === barValue];
    const pair = getActiveAndPath(currentPathname, to, qsFromLocation, matches);
    return value === undefined ? pair : [value === barValue, pair[1]];
  }, [to, value, barValue, currentPathname, qsFromLocation, matches]);

  useEffect(() => {
    if (active) {
      setActiveRef(ref);
    }
  }, [setActiveRef, active]);

  return (
    <li className={className}>
      <Button
        ref={ref}
        as={to ? Link : 'button'}
        type={to ? undefined : 'button'}
        to={path}
        replace={replace}
        role="tab"
        aria-selected={active}
        className={cn({ active, disabled })}
        {...props}
        onClick={(event: any) => {
          onValueChange(value);
          onClick?.(event);
        }}
        onKeyDown={(event: KeyboardEvent) => {
          if (value !== undefined && [' ', 'Enter'].includes(event.key)) {
            onValueChange(value);
          }
        }}
      />
    </li>
  );
};

export const Separator = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg width="1" height="24">
        <rect width="1" height="24" fill="var(--c-neutral-400)" />
      </svg>
    </div>
  );
};

const AnimatedDiv = styled(animated.div)`
  position: absolute;
  top: var(--bar-padding);
  bottom: var(--bar-padding);
  left: 0;
  width: 0;
  z-index: 1;
  background-color: var(--active-bg-color);
  border-radius: var(--triple-unit);
`;

type ActiveBackgroundProps = {
  className?: string;
  delayMS?: number;
};

type AnimatedBackgroundProps = ActiveBackgroundProps & {
  activeElement: HTMLElement;
};

const AnimatedBackground = ({
  activeElement,
  delayMS = 300,
  ...props
}: AnimatedBackgroundProps) => {
  const [immediate, setImmediate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setImmediate(false), delayMS);
    return () => clearTimeout(timer);
  }, [delayMS]);

  const { width: windowWidth } = useWindowSize();
  const { offsetLeft } = activeElement;
  const { width } = activeElement.getBoundingClientRect();
  const [style] = useSpring(
    {
      left: offsetLeft,
      width,
      config: { tension: 370, friction: 36 },
      immediate,
    },
    [windowWidth, width, offsetLeft]
  );

  return <AnimatedDiv style={style} {...props} />;
};

export const ActiveBackground = (props: ActiveBackgroundProps) => {
  const context = useTabBarContext('ActiveBackground');
  const { activeRef } = context;
  if (!activeRef?.current) return null;
  return <AnimatedBackground {...props} activeElement={activeRef.current} />;
};

export const TabBar = ({ children, ...props }: Props) => {
  return (
    <Root {...props}>
      <Bar>{children}</Bar>
      <ActiveBackground />
    </Root>
  );
};

export const ScrollableTabBar = ({ ...props }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollContainer ref={ref}>
      <TabBar {...props} scrollContainerRef={ref} />
    </ScrollContainer>
  );
};
