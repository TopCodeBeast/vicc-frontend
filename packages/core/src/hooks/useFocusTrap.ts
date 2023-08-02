import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useKey } from 'react-use';

function useFocusTrap(trigger: boolean) {
  // any because querySelector is only available on HTMLElement
  // but if you attach a HTMLFormElement on it, he won't be happy either.
  const ref = useRef<any>(null);
  const focusableEls = useMemo(() => {
    if (ref.current && trigger) {
      return ref.current.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      ) as NodeListOf<HTMLElement>;
    }
    return [];
  }, [trigger]);

  const focusNextElement = useCallback(
    (e: any) => {
      if (!trigger) {
        return;
      }
      const arr = Array.prototype.slice.call(focusableEls);
      const nextIndex = arr.findIndex(el => el === document.activeElement) + 1;
      const nextFocusableEl =
        focusableEls[nextIndex < focusableEls.length ? nextIndex : 0];
      if (nextFocusableEl) {
        nextFocusableEl.focus();
      }
      e.preventDefault();
    },
    [focusableEls, trigger]
  );
  const focusPreviousElement = useCallback(
    (e: any) => {
      if (!trigger) {
        return;
      }
      const arr = Array.prototype.slice.call(focusableEls);
      const prevIndex = arr.findIndex(el => el === document.activeElement) - 1;
      const prevFocusableEl =
        focusableEls[prevIndex < 0 ? focusableEls.length - 1 : prevIndex];
      if (prevFocusableEl) {
        prevFocusableEl.focus();
      }
      e.preventDefault();
    },
    [focusableEls, trigger]
  );
  useKey(
    ({ code, shiftKey }) => code === 'Tab' && !shiftKey,
    focusNextElement,
    undefined,
    [trigger]
  );
  useKey('ArrowDown', focusNextElement, undefined, [trigger]);
  useKey('ArrowUp', focusPreviousElement, undefined, [trigger]);
  useKey(
    ({ code, shiftKey }) => code === 'Tab' && shiftKey,
    focusPreviousElement,
    undefined,
    [trigger]
  );

  useEffect(() => {
    let activeElement: HTMLElement | null;
    if (trigger) {
      activeElement = document.activeElement as HTMLElement;
    }
    return () => {
      if (trigger && activeElement) {
        activeElement.focus();
      }
    };
  }, [trigger]);

  useEffect(() => {
    if (trigger) {
      const elements = Array.prototype.slice.call(focusableEls);
      const autoFocusElement = elements.find(el => el.checked);
      if (autoFocusElement) {
        autoFocusElement.focus();
      }
    }
  }, [trigger, focusableEls]);

  return ref;
}

export default useFocusTrap;
