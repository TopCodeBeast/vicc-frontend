import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

export const TrendTitle = styled(Text16).attrs({ bold: true })`
  color: var(--c-neutral-1000);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const TrendDescription = styled(Text16)`
  color: var(--c-neutral-600);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
