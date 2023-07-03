import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Eth = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="m8 10 6-3-5-7H7L2 7l6 3Z" fill="currentColor" />
    <path
      d="M8 12.236 2.262 9.367 7 16h2l4.738-6.633L8 12.237Z"
      fill="currentColor"
    />
  </svg>
);
