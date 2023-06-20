import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Injured = ({
  title = 'injured',
  titleId = 'injured',
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 15H0V12L7 0H9L16 12V15Z"
      fill="#F0CE1D"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 4H9V9H7V4ZM7 11H9V13H7V11Z"
      fill="#0D0C11"
    />
  </svg>
);
