import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Info = ({
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
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM7 8H6V6h3v5h1v2H7V8Zm2-3V3H7v2h2Z"
      fill="currentColor"
    />
  </svg>
);
