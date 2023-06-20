import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';

import { useClearAllFilters } from '@sorare/marketplace/src/search/ClearAllFilters';

const messages = defineMessages({
  clearFilters: {
    id: 'NoResults.clearFilters',
    defaultMessage: 'Clear all filters',
  },
  goBack: {
    id: 'NoResults.goBack',
    defaultMessage: 'Go back',
  },
});

const CTAs = styled.div`
  display: flex;
  gap: var(--unit);
`;

export const NoResults = () => {
  const clearAllFilters = useClearAllFilters();
  const navigate = useNavigate();

  return (
    <CTAs>
      <Button
        medium
        color="darkGray"
        onClick={() => navigate(-1)}
        startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
      >
        <FormattedMessage {...messages.goBack} />
      </Button>
      <Button medium color="blue" onClick={clearAllFilters}>
        <FormattedMessage {...messages.clearFilters} />
      </Button>
    </CTAs>
  );
};

export default NoResults;
