import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

import background from './Field.svg';
import FieldPlayer from './FieldPlayer';

const FieldBackground = styled.div`
  position: relative;
  top: 15px;
  display: flex;
  flex-direction: column;
  gap: calc(6 * var(--unit));
  background-image: url(${background});
  background-size: contain;
  background-repeat: no-repeat;
  width: 375px;
  height: 325px;

  --scoreTagMin: 20px;
  --scoreTagMax: 30px;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const FirstRow = styled(Row)`
  gap: calc(5 * var(--unit));
  top: -45px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    top: -45px;
  }
`;

const SecondRow = styled(Row)`
  gap: calc(13 * var(--unit));
  top: -55px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    top: -40px;
  }
`;

const ThirdRow = styled(Row)`
  gap: calc(5 * var(--unit));
  top: -100px;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    top: -70px;
  }
`;

type Props = {
  visible: boolean;
  nba?: boolean;
};

const Field = ({ visible, nba = false }: Props) => {
  return (
    <FieldBackground>
      <FirstRow>
        <FieldPlayer
          visible={visible}
          number={1}
          score={60}
          scarcity="common"
          nba={nba}
        />
        <FieldPlayer
          visible={visible}
          number={2}
          score={67}
          scarcity="unique"
          nba={nba}
        />
      </FirstRow>
      <SecondRow>
        <FieldPlayer
          visible={visible}
          number={3}
          score={65}
          scarcity="limited"
          nba={nba}
        />
        <FieldPlayer
          isCaptain
          visible={visible}
          number={4}
          score={62}
          scarcity="superRareMlb"
          nba={nba}
        />
      </SecondRow>
      <ThirdRow>
        <FieldPlayer
          visible={visible}
          number={5}
          score={91}
          scarcity="rare"
          nba={nba}
        />
      </ThirdRow>
    </FieldBackground>
  );
};

export default Field;
