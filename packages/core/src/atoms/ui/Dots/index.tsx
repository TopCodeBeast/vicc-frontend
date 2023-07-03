import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

export type Props = {
  count: number;
  size: 'small' | 'medium';
};

const Dot = styled(FontAwesomeIcon)<{ $size: Props['size'] }>`
  vertical-align: middle;
  ${({ $size }) =>
    $size === 'small'
      ? css`
          width: 6px !important;
          height: 4px;
        `
      : css`
          width: 15px !important;
          height: 10px;
        `}
`;

export const Dots = ({ count, size }: Props) => {
  const arr = useMemo(
    () => new Array(count).fill(null).map((_, i) => i + 1),
    [count]
  );
  return (
    <>
      {arr.map(index => (
        <Dot key={index} icon={faCircle} $size={size} />
      ))}
    </>
  );
};

export default Dots;
