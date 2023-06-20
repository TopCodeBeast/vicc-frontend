import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const Ball = ({
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
    <path d="M16 8c0 2.3-.971 4.374-2.526 5.833l-1.46-2.009 1.482-4.559 2.363-.768c.093.487.141.99.141 1.503Zm-5.603 5 1.46 2.01A7.965 7.965 0 0 1 8 16a7.964 7.964 0 0 1-3.857-.99L5.603 13h4.794ZM0 8c0 2.3.971 4.374 2.526 5.833l1.46-2.009-1.482-4.559-2.363-.768C.048 6.984 0 7.487 0 8Zm3.122-2.637L.758 4.595A8.007 8.007 0 0 1 7 .062v2.484L3.122 5.363ZM9 2.546V.062a8.007 8.007 0 0 1 6.242 4.533l-2.364.768L9 2.546ZM4.473 6.854 8 4.29l3.527 2.563L10.18 11H5.82L4.473 6.854Z" />
  </svg>
);
