import React from 'react';

import { Container } from '@core/atoms/container';
import Scrollable from '@core/components/Scrollable';

type Props = {
  className?: string;
  itemToDisplay?: number;
  children: React.ReactNode;
};

export const HorizontalScrollContainer = ({
  children,
  itemToDisplay = 3,
}: Props) => {
  return (
    <Container>
      <Scrollable itemToDisplay={itemToDisplay} overhang withMask>
        {children}
      </Scrollable>
    </Container>
  );
};
