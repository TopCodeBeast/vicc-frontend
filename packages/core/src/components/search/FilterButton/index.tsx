import { faFilter } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { filters } from '@sorare/core/src/lib/glossary';

const StyledButton = styled(Button)`
  width: 130px;
  margin: auto;
`;

const StyledText16 = styled(Text16)`
  display: inline-flex;
  gap: var(--half-unit);
`;

type Props = { onClick: () => void; filtersCount?: number; className?: string };

export const FilterButton = ({
  onClick,
  filtersCount = 0,
  className,
}: Props) => {
  return (
    <StyledButton
      color="dark"
      onClick={onClick}
      title="Toggle filters"
      startIcon={<FontAwesomeIcon icon={faFilter} />}
      medium
      className={className}
    >
      <StyledText16 bold>
        <FormattedMessage {...filters.filters} />
        {filtersCount > 0 && <span>({filtersCount})</span>}
      </StyledText16>
    </StyledButton>
  );
};
