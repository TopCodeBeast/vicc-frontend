import { SVGProps } from 'react';

type SVGRProps = {
  title?: string;
  titleId?: string;
  color?: string;
  backgroundColor?: string;
};

export const Lightning = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="9"
    height="12"
    viewBox="0 0 9 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    <path
      d="M5.25 5.25L6 0H4.5L0 5.25V6.75H3.75L3 12H4.5L9 6.75L9 5.25H5.25Z"
      fill="url(#paint0_linear_9120_2055)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9120_2055"
        x1="3.6"
        y1="10.5"
        x2="11.1377"
        y2="-0.292684"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFB524" />
        <stop offset="1" stopColor="#F3E7D0" />
      </linearGradient>
    </defs>
  </svg>
);
export default Lightning;
