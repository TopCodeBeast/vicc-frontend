import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const ChevronRightBold = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="11"
    height="16"
    viewBox="0 0 11 16"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.17176 8.00015L0.585972 3.41436L3.4144 0.585938L10.8286 8.00015L3.4144 15.4144L0.585972 12.5859L5.17176 8.00015Z"
      fill="currentColor"
    />
  </svg>
);
