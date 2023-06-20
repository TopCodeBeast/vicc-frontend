import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
  img {
    max-height: 52px;
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
