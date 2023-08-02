import styled from 'styled-components';

import { ExclamationIcon } from '@core/components/collections/DetailedScoreLine/ExclamationIcon';

const Wrapper = styled.div`
  position: relative;
  grid-area: img;
`;

const ExclamationBadge = styled(ExclamationIcon)`
  position: absolute;
  top: -5px;
  right: -5px;
`;

const Img = styled.img`
  width: 40px;
  aspect-ratio: 1;
`;

type Props = {
  img: string;
  listed?: boolean;
};

export const Image = ({ img, listed }: Props) => {
  return (
    <Wrapper>
      {listed && <ExclamationBadge />}
      <Img src={img} alt="" />
    </Wrapper>
  );
};
