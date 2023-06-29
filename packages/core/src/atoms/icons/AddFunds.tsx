import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

export const AddFunds = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    viewBox="0 0 89 89"
    width="89"
    height="89"
    fill="currentColor"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M41.675 19.23h5.867v22.217h22.434v5.867H47.543v21.782h-5.867V47.314H20.11v-5.867h21.565zm37.242 8.582a38.18 38.18 0 0 0-17.795-18.02V3.834a43.604 43.604 0 0 1 23.72 23.977h-5.925zM61.122 78.21a38.184 38.184 0 0 0 17.426-17.26h5.98a43.609 43.609 0 0 1-23.406 23.215zm-50.67-17.26a38.183 38.183 0 0 0 17.534 17.31v5.948A43.608 43.608 0 0 1 4.472 60.95zM27.986 9.74a38.179 38.179 0 0 0-17.903 18.073H4.158A43.603 43.603 0 0 1 27.986 3.791v5.948z"
      clipRule="evenodd"
    />
  </svg>
);
