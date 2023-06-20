import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const ChevronDownBold = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="12"
    height="9"
    viewBox="0 0 12 9"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5608 2.81077L6.00011 8.37143L0.439453 2.81077L2.56077 0.689453L6.00011 4.12879L9.43945 0.689453L11.5608 2.81077Z"
      fill="currentColor"
    />
  </svg>
);
