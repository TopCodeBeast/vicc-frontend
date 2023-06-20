import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Diamond = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    <path
      fill="currentcolor"
      d="M6 1.5 0 9h24l-6-7.5H6ZM12 24 0 12h24L12 24Z"
    />
  </svg>
);
