import { ReactNode, useState } from 'react';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useTransitionApi from '@sorare/core/src/hooks/useTransitionApi';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-bottom: var(--quadruple-unit);
  z-index: 3;
  background: var(--c-neutral-100);
  flex-direction: column;
  gap: var(--double-unit);
  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;

const StyledSearchInput = styled(SearchInput)`
  @media ${tabletAndAbove} {
    min-width: 200px;
  }
`;

type Props = {
  onSearchInputChange: (value: string) => void;
  searchPlaceholder: string;
  children?: ReactNode;
};

export const Header = ({
  onSearchInputChange,
  searchPlaceholder,
  children,
}: Props) => {
  const isDesktop = useIsDesktop();
  const { updateDOM } = useTransitionApi();

  const [searchValue, setSearchValue] = useState('');
  useDebounce(
    () => {
      updateDOM(() => {
        onSearchInputChange(searchValue);
      });
    },
    500,
    [searchValue]
  );

  return (
    <Wrapper>
      {children}
      <StyledSearchInput
        placeholder={searchPlaceholder}
        fullWidth={!isDesktop}
        withIcon
        onChange={e => setSearchValue(e.target.value)}
      />
    </Wrapper>
  );
};
