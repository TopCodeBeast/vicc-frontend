import styled from 'styled-components';

import { Container } from '@core/atoms/container';
import { Color } from '@core/style/types';

export const ColouredContainer = styled(Container)<{ color: Color }>`
  background-color: ${({ color }) => color};
`;

export default ColouredContainer;
