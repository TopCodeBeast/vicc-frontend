import { SVGProps } from 'react';

import { Color } from '@core/style/types';

interface SVGRProps {
  title?: string;
  titleId?: string;
  width?: number;
  checked: boolean;
  fillColor?: Color;
}

export const Radio = ({
  title,
  titleId,
  checked,
  width = 20,
  fillColor = undefined,

  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => {
  const color = (checked && fillColor) || 'currentColor';

  return (
    <svg
      width={width}
      viewBox="0 0 24 24"
      fill={checked ? fillColor || 'currentColor' : 'none'}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx="12"
        cy="12"
        r="11"
        stroke={color}
        strokeWidth="2"
        fill="transparent"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill={checked ? color : 'transparent'}
        strokeWidth="2"
      />
    </svg>
  );
};
