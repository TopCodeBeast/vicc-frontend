import { ReactNode } from 'react';
import styled from 'styled-components';

import { Title3 } from '@core/atoms/typography';

const Root = styled(Title3)`
  color: var(--c-neutral-1000);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type Props = {
  title: string | ReactNode;
};

const BlockHeader = ({ title }: Props) => {
  return <Root as="h6">{title}</Root>;
};

export default BlockHeader;
