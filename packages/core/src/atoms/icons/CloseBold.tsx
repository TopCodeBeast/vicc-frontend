import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const CloseBold = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.17172 8.00015L0.585938 3.41436L3.41436 0.585938L8.00015 5.17172L12.5859 0.585938L15.4144 3.41436L10.8286 8.00015L15.4144 12.5859L12.5859 15.4144L8.00015 10.8286L3.41436 15.4144L0.585938 12.5859L5.17172 8.00015Z"
      fill="currentColor"
    />
  </svg>
);
