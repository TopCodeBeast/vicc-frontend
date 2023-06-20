import styled from 'styled-components';

import { SecondaryTabs } from '@sorare/core/src/atoms/navigation/SecondaryTabs';

const StyledSecondaryTabs = styled(SecondaryTabs)<{
  badgeColor?: string;
}>`
  --link: var(--c-neutral-600);
  --activeLink: var(--c-neutral-1000);
  --activeLinkBg: var(--c-neutral-400);
  --icon: var(--link);
  --activeIcon: var(--activeLink);
  --badge: var(--link);
  --activeBadge: var(--activeLink);
  --activeBadgeBg: ${({ badgeColor }) => badgeColor};
`;

export default StyledSecondaryTabs;
