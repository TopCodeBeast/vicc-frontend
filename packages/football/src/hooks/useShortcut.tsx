import { DependencyList } from 'react';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useShortcut as useCoreShortcut } from '@sorare/core/src/hooks/useShortcut';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

const Key = styled(Caption).attrs({
  as: 'small',
  bold: true,
})`
  display: none;
  @media ${laptopAndAbove} {
    display: inline-flex;
    padding: 0 6px; /* custom value because it's an icon */
    margin-left: var(--unit);
    border: solid currentColor;
    border-radius: var(--half-unit);
    border-width: 1px 2px 4px;
    color: var(--c-neutral-400);
  }
`;

// typescript doesn't support types for userAgentData yet
const isMac = /mac/i.test(
  (navigator as any).userAgentData?.platform ||
    // eslint-disable-next-line deprecation/deprecation
    navigator.platform
);

const SHORTCUTS = {
  cmdk: {
    predicate: (event: KeyboardEvent) => {
      return event.key === 'k' && (event.metaKey || event.ctrlKey);
    },
    label: isMac ? '⌘+k' : 'ctrl+k',
  },
  '1': {
    predicate: (event: KeyboardEvent) => event.code === 'Digit1',
    label: '1',
  },
  '2': {
    predicate: (event: KeyboardEvent) => event.code === 'Digit2',
    label: '2',
  },
  '3': {
    predicate: (event: KeyboardEvent) => event.code === 'Digit3',
    label: '3',
  },
  '4': {
    predicate: (event: KeyboardEvent) => event.code === 'Digit4',
    label: '4',
  },
  '5': {
    predicate: (event: KeyboardEvent) => event.code === 'Digit5',
    label: '5',
  },
  down: {
    predicate: (event: KeyboardEvent) => event.code === 'ArrowDown',
    label: '↓',
  },
  up: {
    predicate: (event: KeyboardEvent) => event.code === 'ArrowUp',
    label: '↑',
  },
  f: { predicate: 'f', label: 'f' },
  s: { predicate: 's', label: 's' },
  u: { predicate: 'u', label: 'u' },
  n: { predicate: 'n', label: 'n' },
  a: { predicate: 'a', label: 'a' },
};

const useShortcut = (
  shortcut: keyof typeof SHORTCUTS,
  callback: () => void,
  deps?: DependencyList
) => {
  const {
    flags: { useFootballShortcuts = false },
  } = useFeatureFlags();

  useCoreShortcut(
    useFootballShortcuts ? SHORTCUTS[shortcut].predicate : undefined,
    callback,
    deps
  );
  return {
    Icon: useFootballShortcuts ? <Key>{SHORTCUTS[shortcut].label}</Key> : null,
  };
};
export default useShortcut;
