import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const linearGradientProps = {
  x1: 1,
  x2: 0.6,
  y1: 1,
  y2: 0,
};
const gradients = [
  { id: 'svg-limited-gradient', colors: ['#ae5e13', '#dfad46'] },
  { id: 'svg-mix-gradient', colors: ['#391885', '#c43ba9'] },
  { id: 'svg-rare-gradient', colors: ['#c22342', '#f2412d'] },
  { id: 'svg-super_rare-gradient', colors: ['#366bf2', '#6b49db'] },
  { id: 'svg-unique-gradient', colors: ['#171717', '#4D4B49'] },
  { id: 'svg-rookie-gradient', colors: ['#0d0c11'] },
  { id: 'svg-academy-gradient', colors: ['#0840d1', '#00a3ff'] },
  { id: 'svg-rewards-1st-gradient', colors: ['#FFC931', '#FC7D22'] },
  { id: 'svg-rewards-2nd-gradient', colors: ['#FFFFFF', '#C0C0C0'] },
  { id: 'svg-rewards-3rd-gradient', colors: ['#EBA278', '#DCA883'] },
];

export const SvgProvider = ({ children }: Props) => {
  return (
    <>
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', display: 'block', height: 0, width: 0 }}
      >
        {gradients.map(({ id, colors }) => {
          return (
            <linearGradient key={id} id={id} {...linearGradientProps}>
              {colors.map((c, index) => (
                <stop key={c} offset={index} stopColor={c} />
              ))}
            </linearGradient>
          );
        })}
        <linearGradient
          id="svg-special-reward-gradient"
          gradientTransform="rotate(100)"
        >
          <stop offset="0.01" stopColor="var(--c-static-reward-200)" />
          <stop offset="1" stopColor="var(--c-static-reward-900)" />
        </linearGradient>
      </svg>
      {children}
    </>
  );
};

export default SvgProvider;
