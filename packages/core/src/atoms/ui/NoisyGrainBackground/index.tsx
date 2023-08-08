import styled from 'styled-components';

import noiseUrl from './assets/noise.svg';

export const NoisyGrainBackground = styled.div`
  background-image: url(${noiseUrl});
  background-size: 100px 100px;
  background-repeat: repeat;
  background-position: center;
  background-blend-mode: difference;
`;
