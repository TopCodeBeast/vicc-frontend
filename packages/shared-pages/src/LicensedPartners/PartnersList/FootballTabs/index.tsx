import { useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { LICENSED_PARTNERS_FOOTBALL_TAB } from '@sorare/core/src/constants/routes';

import { StyledTabs } from '@shared-pages/LicensedPartners/StyledTabs';

const FiltersWrapper = styled.div`
  flex: 1;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

export const FootballTabs = () => {
  const { formatMessage } = useIntl();
  return (
    <FiltersWrapper>
      <StyledTabs
        items={[
          {
            label: formatMessage({
              id: 'LicensedClubs.FootballTabs.clubs',
              defaultMessage: 'Clubs',
            }),
            to: generatePath(LICENSED_PARTNERS_FOOTBALL_TAB, {
              tab: 'clubs',
            }),
          },
          {
            label: formatMessage({
              id: 'LicensedClubs.FootballTabs.coverage',
              defaultMessage: 'Coverage',
            }),
            to: generatePath(LICENSED_PARTNERS_FOOTBALL_TAB, {
              tab: 'competitions',
            }),
          },
        ]}
      />
    </FiltersWrapper>
  );
};
