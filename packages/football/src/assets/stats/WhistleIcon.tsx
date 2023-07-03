const WhistleIcon = ({
  title,
  color = 'currentColor',
}: {
  title?: string;
  color?: string;
}) => {
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M3.15533 3.59467L6.75 0L8.625 1.875L6.10888 5.33467C6.95751 6.02218 7.5 7.07274 7.5 8.25C7.5 10.3211 5.82107 12 3.75 12L3.74053 12L3.73106 12C1.68081 12 0 10.3379 0 8.28769L4.70507e-05 8.26899L0 8.25C0 7.02264 0.589641 5.933 1.5011 5.2489L2.09467 4.65533L3.21967 5.78033L4.28033 4.71967L3.15533 3.59467Z"
        fill={color}
      />
    </svg>
  );
};

export default WhistleIcon;
