import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title4 } from '@core/atoms/typography';
import Dialog from '@core/components/dialog';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { tabletAndAbove } from '@core/style/mediaQuery';

type Props = {
  url: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const Iframe = styled.iframe`
  display: block;
  border: none;
  width: 100%;
  height: 100%;
  margin: auto;

  @media ${tabletAndAbove} {
    /* Dimensions taken from 3DS v2 spec */
    width: 500px;
    height: 600px;
    max-width: 100%;
    max-height: 100%;
  }
`;

const Title = styled(Title4)`
  text-align: center;
`;

const THREE_D_SECURE_MESSAGE = 'sorare:payment:3DS-authentication-complete';

export const ThreeDSIframe = ({ url, onSuccess, onCancel }: Props) => {
  const { up: isTablet } = useScreenSize('tablet');

  useEffect(() => {
    const cb = (event: MessageEvent) => {
      if (event.data === THREE_D_SECURE_MESSAGE) {
        onSuccess();
      }
    };
    window.addEventListener('message', cb);

    return () => window.removeEventListener('message', cb);
  }, [onSuccess]);

  return (
    <Dialog
      open
      disableBackdropClick
      disableEscapeKeyDown
      title={
        <Title>
          <FormattedMessage
            id="ThreeDSIframe.title"
            defaultMessage="3D secure authentication"
          />
        </Title>
      }
      onClose={onCancel}
      maxWidth={false}
      fullScreen={!isTablet}
      body={<Iframe src={url} />}
    />
  );
};
