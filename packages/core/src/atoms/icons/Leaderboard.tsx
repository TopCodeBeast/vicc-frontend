import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const LeaderboardIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    <path
      d="M15 1H1v6h2.382l1.5-3h2.236L10 9.764 11.382 7H15V1Z"
      fill="currentColor"
    />
    <path
      d="M15 9h-2.382l-1.5 3H8.882L6 6.236 4.618 9H1v6h14V9Z"
      fill="currentColor"
    />
  </svg>
);

export default LeaderboardIcon;
