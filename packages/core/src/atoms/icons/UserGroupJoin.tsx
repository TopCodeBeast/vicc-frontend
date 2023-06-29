import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const UserGroupJoin = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 25 25"
    width="25"
    height="25"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M23.1118 2.82626C21.4118 1.86695 16.9218 0.119995 12.0218 0.119995C7.12183 0.119995 2.56183 1.89724 0.891833 2.84645C0.311833 3.16959 -0.0281669 3.80576 0.00183308 4.47223C0.101833 6.36056 0.381833 8.06712 0.771833 9.64241H10.4918L10.3118 9.43035L6.82183 5.26997H10.7518L15.8318 11.3288L10.6518 17.0644H6.60183L10.6318 12.6011H1.67183C4.23183 19.3567 8.98183 22.6587 10.9718 23.8705C11.5918 24.2441 12.3818 24.1936 12.9518 23.7493C21.1618 17.3169 23.6218 7.81467 23.9918 4.57321C24.0718 3.86635 23.7318 3.17969 23.1118 2.83636V2.82626Z"
      fill="currentColor"
    />
  </svg>
);
