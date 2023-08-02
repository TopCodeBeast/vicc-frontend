import { ReactNode } from 'react';
import styled from 'styled-components';

import { Link } from '@sorare/core/src/routing/Link';

type Props = {
  to: string;
  img: ReactNode;
  infos: ReactNode;
  numbers?: ReactNode;
  onClick?: () => void;
};

const Root = styled(Link)`
  padding: 0;
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);

  &:hover {
    opacity: 0.5;
  }
`;
const Img = styled.div`
  aspect-ratio: var(--card-aspect-ratio);
  height: 52px;
  overflow: hidden;
  img {
    max-width: 100%;
  }
`;
const Infos = styled.div`
  flex: 1;
  overflow: hidden;
`;
const Numbers = styled.div`
  text-align: right;
`;

export const Trend = ({ to, img, infos, numbers, onClick }: Props) => {
  return (
    <Root to={to} onClick={onClick}>
      <Img>{img}</Img>
      <Infos>{infos}</Infos>
      {numbers && <Numbers>{numbers}</Numbers>}
    </Root>
  );
};
