import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { StackedCards } from '@sorare/core/src/atoms/icons/StackedCards';

const CardSymbol = styled.div`
  width: 8px;
  height: 12px;
  border-radius: 2px;
  background-color: currentColor;
`;

const StackedSwitch = () => {
  const unstacked = true;

  return (
    <IconButton
      small
      color="white"
      onClick={() => {}}
    >
      {unstacked ? <StackedCards /> : <CardSymbol />}
    </IconButton>
  );
};

export default StackedSwitch;
