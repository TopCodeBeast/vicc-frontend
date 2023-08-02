import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';

const Root = styled.div`
  text-align: left;
`;

type Props = {
  name: string;
  status?: ReactNode;
};

export const ClubShopItemFooter = ({ name, status = null }: Props) => {
  return (
    <Root>
      {status}
      <Text14 color="var(--c-neutral-600)">{name}</Text14>
    </Root>
  );
};
