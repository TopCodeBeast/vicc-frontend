import confetti from 'canvas-confetti';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';

const defaultConfettisParams = {
  colors: ['#FFC700'],
  gravity: 0.4,
  decay: 0.95,
  ticks: 150,
  spread: 45,
};

type Props = {
  leftAngle?: number;
  rightAngle?: number;
  origin?: { x: number; y: number };
  power?: number;
};

// using a separate object to avoid re-rendering the component everytime when the origin props is not set
const defaultOrigin = { x: 0.5, y: 0.9 };

const Root = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const Confetti = ({
  leftAngle = 67,
  rightAngle = 113,
  origin = defaultOrigin,
  power = 20,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    if (canvasRef.current) {
      if (canvasRef.current.getBoundingClientRect().width > 0) {
        setCanvas(canvasRef.current);
      } else {
        /*
          Sometimes the canvas width is initially 0, even when using useLayoutEffect
          For those cases we watch the size of the canvas to make sure the confettis are created only once the canvas has a proper width
        */
        const observer = new ResizeObserver(() => {
          const newWidth = canvasRef.current!.getBoundingClientRect().width;
          if (newWidth > 0) {
            setCanvas(canvasRef.current);
          }
        });
        observer.observe(canvasRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }
    return undefined;
  }, [canvasRef]);

  useEffect(() => {
    if (canvas) {
      const launch = confetti.create(canvas, {
        disableForReducedMotion: true,
        resize: true,
        useWorker: true,
      });

      launch({
        ...defaultConfettisParams,
        origin,
        angle: leftAngle,
        startVelocity: power,
      });
      launch({
        ...defaultConfettisParams,
        origin,
        angle: rightAngle,
        startVelocity: power,
      });
    }
  }, [canvas, leftAngle, rightAngle, origin, power]);

  return <Root ref={canvasRef} />;
};

export default Confetti;
