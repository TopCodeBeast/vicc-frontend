import { HTMLAttributes } from 'react';
import styled from 'styled-components';

import Shine from '@sorare/core/src/atoms/ui/Shine';

type Props = {
  path: string;
  shine?: boolean;
  radius?: string;
} & HTMLAttributes<HTMLElement>;

const Image = styled.img`
  aspect-ratio: var(--card-aspect-ratio);
  width: 235px;
  max-width: 100%;
`;

export const CardBack = ({
  path,
  shine,
  radius = '10px',
  ...divAttributes
}: Props) => {
  return (
    <Shine disabled={!shine} borderRadius={radius} {...divAttributes}>
      <Image src={path} alt="" />
    </Shine>
  );
};

export default CardBack;
