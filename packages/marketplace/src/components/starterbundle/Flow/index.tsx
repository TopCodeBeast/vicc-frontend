import { ReactNode } from 'react';
import styled from 'styled-components';

import { Background } from '@sorare/core/src/components/rewards/Background';

const FullScreenBackground = styled(Background).attrs({ black: false })`
  height: 100%;
  width: 100%;
  overflow: auto;
`;
const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;

export type Props = {
  children: ReactNode;
};

export const StarterBundleFlow = ({ children }: Props) => {
  return (
    <FullScreenBackground text="STARTER">
      <ColumnLayout>{children}</ColumnLayout>
    </FullScreenBackground>
  );
};
