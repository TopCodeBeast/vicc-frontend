import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import { glossary } from '@sorare/core/src/lib/glossary';

type Props = {
  placeholder?: string;
  withClearIcon?: boolean;
  favPlayerHit?: {
    display_name: string;
  };
};

const Root = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  & > * {
    width: 100%;
  }
`;

export const SearchBox = (props: Props) => {
  const { placeholder, withClearIcon } = props;
  const { formatMessage } = useIntl();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  
  return (
    <Root>
      <SearchInput
        fullWidth
        small
        rounded
        value={value}
        inputRef={inputRef}
        onChange={handleChange}
        placeholder={placeholder || formatMessage(glossary.search)}
        withIcon
        withClearIcon={withClearIcon}
        onClear={() => {
          setValue('');
        }}
        name="search-box"
      />
    </Root>
  );
};

export default SearchBox;
