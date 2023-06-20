import { SVGProps } from 'react';

export const Weekly = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      height={40}
      width={40}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M20 39c10.493 0 19-8.507 19-19S30.493 1 20 1 1 9.507 1 20s8.507 19 19 19zm-5-27h3v2h4v-2h3v2h2v3H13v-3h2zm-2 15v-8h14v8z"
        fill="var(--c-neutral-1000)"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default Weekly;
