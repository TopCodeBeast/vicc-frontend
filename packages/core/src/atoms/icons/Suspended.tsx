import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Suspended = ({
  title = 'suspended',
  titleId = 'suspended',
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect
      x="0.644897"
      y="1.5"
      width="7.5"
      height="12"
      rx="1.2"
      ry="1.2"
      fill="rgb(255, 68, 68)"
    />
    <rect
      x="4.2"
      y="0"
      width="7.5"
      height="12"
      rx="1.2"
      ry="1.2"
      fill="rgb(255, 233, 68)"
      transform="matrix(0.848048, 0.529919, -0.529919, 0.848048, 6, 0)"
    />
  </svg>
);
