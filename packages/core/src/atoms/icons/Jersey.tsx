import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Jersey = ({
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
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m6 1 2 2 2-2h6v4l-3 1v6H3V6L0 5V1h6Zm4 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      transform="translate(0 -1)"
      fill="currentColor"
    />
    <path d="M3 15v-2h10v2H3Z" fill="currentColor" />
  </svg>
);
