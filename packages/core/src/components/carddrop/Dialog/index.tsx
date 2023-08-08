import { ElementType } from 'react';
import styled from 'styled-components';

import { StepProps } from '@core/components/carddrop/types';
import Dialog from '@core/components/dialog';
import { laptopAndAbove } from '@core/style/mediaQuery';

import { CardDropFlow } from '../Flow';

const FullSize = styled.div`
  height: 100%;
  @media ${laptopAndAbove} {
    height: calc(100vh - 8 * var(--unit));
  }
`;

type Props = {
  open: boolean;
  onClose: StepProps['onClose'];
  steps: ElementType<StepProps>[];
};

export const CardDropDialog = ({ open, steps, onClose }: Props) => {
  return (
    <Dialog open={open} fullWidth maxWidth={false}>
      <FullSize>
        <CardDropFlow steps={steps} onClose={onClose} />
      </FullSize>
    </Dialog>
  );
};
