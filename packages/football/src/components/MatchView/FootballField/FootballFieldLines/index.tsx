type Props = { desktop?: boolean };
const FootballFieldLines = ({ desktop }: Props) =>
  desktop ? (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1136 360"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="cut-off-left">
        <rect x="150.5" y="0" width="100%" height="100%" />
      </clipPath>
      <clipPath id="cut-off-right">
        <rect x="0" y="0" width="985.5px" height="100%" />
      </clipPath>
      <path
        d="M0,48 L150,48 150,312 0,312"
        fill="#529661"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <path
        d="M0,113 L50,113 50,247 0,247"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <circle
        cx="120"
        cy="180"
        r="62"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
        clipPath="url(#cut-off-left)"
      />

      <line
        x1="568"
        y1="0"
        x2="568"
        y2="100%"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
      />
      <circle
        cx="568"
        cy="180"
        r="84"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />

      <path
        d="M1136,48 L986,48 986,312 1136,312"
        fill="#529661"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <path
        d="M1136,113 L1086,113 1086,247 1136,247"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <circle
        cx="1016"
        cy="180"
        r="62"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
        clipPath="url(#cut-off-right)"
      />
    </svg>
  ) : (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 360 1136"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="cut-off-top">
        <rect x="0" y="150.5" width="100%" height="100%" />
      </clipPath>
      <clipPath id="cut-off-bottom">
        <rect x="0" y="0" width="100%" height="985.5px" />
      </clipPath>

      <path
        d="M48,0 L48,150 312,150 312,0"
        fill="#529661"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <path
        d="M113,0 L113,50 247,50 247,0"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <circle
        cx="180"
        cy="120"
        r="62"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
        clipPath="url(#cut-off-top)"
      />

      <line
        x1="0"
        y1="568"
        x2="100%"
        y2="568"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
      />
      <circle
        cx="180"
        cy="568"
        r="84"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />

      <path
        d="M48,1136 L48,986 312,986 312,1136"
        fill="#529661"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <path
        d="M113,1136 L113,1086 247,1086 247,1136"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
      />
      <circle
        cx="180"
        cy="1016"
        r="62"
        fill="transparent"
        stroke="rgba(var(--c-static-rgb-neutral-100), 0.2)"
        strokeWidth={1}
        clipPath="url(#cut-off-bottom)"
      />
    </svg>
  );

export default FootballFieldLines;
