import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Flag = ({
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
    <path d="M1 1v15h2v-6h4l2 2h6V3H9L7 1H1Z" fill="currentColor" />
  </svg>
);
