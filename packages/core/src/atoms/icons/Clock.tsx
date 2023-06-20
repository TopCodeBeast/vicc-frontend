import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Clock = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM7 3v5.414l3.293 3.293 1.414-1.414L9 7.586V3H7Z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);
