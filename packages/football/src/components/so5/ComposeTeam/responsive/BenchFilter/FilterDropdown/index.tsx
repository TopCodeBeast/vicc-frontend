import { faFilter } from '@fortawesome/pro-solid-svg-icons';
import styled from 'styled-components';

import { IconButton } from '@sorare/core/src/atoms/buttons/IconButton';
import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';

import FilterContent from '@football/components/so5/ComposeTeam/responsive/BenchFilter/FilterContent';

const Wrapper = styled.div`
  padding: var(--double-unit);
`;
const FilterDropdown = () => {
  return (
    <Dropdown
      gap={8}
      label={<IconButton disableDebounce color="white" icon={faFilter} />}
      darkTheme
      align="right"
    >
      <Wrapper>
        <FilterContent />
      </Wrapper>
    </Dropdown>
  );
};

export default FilterDropdown;
