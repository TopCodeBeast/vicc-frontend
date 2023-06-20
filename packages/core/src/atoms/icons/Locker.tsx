import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Locker = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 6V4a4 4 0 1 1 8 0v2h2v10H2V6h2Zm2-2a2 2 0 1 1 4 0v2H6V4Zm1 9V9h2v4H7Z"
      fill="currentColor"
    />
  </svg>
);
