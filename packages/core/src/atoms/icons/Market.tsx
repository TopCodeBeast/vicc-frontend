import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Market = ({
  title = 'market',
  titleId = 'market',
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
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 12H7V9H4V12ZM9 9V15H1.96875V8H0V6L3 1H13L16 6V8H13.9688V15H12V9H9Z"
      fill="currentColor"
    />
  </svg>
);
