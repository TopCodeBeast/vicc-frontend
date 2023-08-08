import { ReactNode } from 'react';
import styled from 'styled-components';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import Body from '@core/atoms/layout/Body';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import '@core/style/romieFontFaces.css';

const Center = styled.div`
  display: flex;
  min-height: 80vh;
`;

type Props = { children: ReactNode };

export const MarketingPage = ({ children }: Props) => {
  const fontStatus = useFontFaceObserver(
    [{ family: 'Romie-regular' }, { family: 'Romie-Italic' }],
    { timeout: 1000 },
    {
      showErrors: true,
    }
  );

  return (
    <Body>
      {fontStatus === 'initial' ? (
        <Center>
          <LoadingIndicator />
        </Center>
      ) : (
        children
      )}
    </Body>
  );
};

export default MarketingPage;
