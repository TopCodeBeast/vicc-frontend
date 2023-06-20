import { useEffect } from 'react';

/**
 * This hook allows to use vh unit safely on safary iOS
 * It will replace the vh to use pixel instead.
 * var(--100vh) should be used instead of 100vh whenever
 * the content fit the viewport, without any scroll (i.e compose team)
 * If you use it while there is a content to scroll, the content will jump when
 * the safari url bar disapear and reappear.
 */
export default function useVh() {
  useEffect(() => {
    let prevWindowHeight: number;
    function setViewportProperty() {
      const doc = document.documentElement;
      const windowHeight = window.innerHeight;
      if (windowHeight === prevWindowHeight) return;
      requestAnimationFrame(() => {
        doc.style.setProperty('--vh', `${windowHeight * 0.01}px`);
        prevWindowHeight = windowHeight;
      });
    }
    setViewportProperty();
    window.addEventListener('resize', setViewportProperty);
    return () => {
      window.removeEventListener('resize', setViewportProperty);
    };
  }, []);
}
