import React, { useEffect, useRef, useState } from 'react';
import { useSearchBox } from 'react-instantsearch-hooks-web';
import { useIntl } from 'react-intl';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import ManagerTaskTooltip from '@sorare/core/src/components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask from '@sorare/core/src/components/onboarding/managerTask/MarketplaceOnboardingTask';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  // useManagerTaskContext,
} from '@sorare/core/src/contexts/managerTask';
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

const DEFAULT_MARKETPLACE_TASK_SEARCH = 'saka';

export const SearchBox = (props: Props) => {
  const { placeholder, withClearIcon, favPlayerHit } = props;
  // const { setStep, task } = useManagerTaskContext();
  const { formatMessage } = useIntl();
  const { query, refine } = useSearchBox();
  const [value, setValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldOpenNextOnboarding, setShouldOpenNextOnboarding] =
    useState(false);

  // Track when the value coming from the React state changes to synchronize it with InstantSearch.
  useDebounce(
    () => {
      if (query !== value) {
        refine(value);
      }
    },
    300,
    [query, value]
  );

  useEffect(() => {
    if (query === value && shouldOpenNextOnboarding) {
      // setStep(MarketplaceOnboardingStep.marketplaceItem);
      setShouldOpenNextOnboarding(false);
    }
  }, [shouldOpenNextOnboarding, value, query/*, setStep*/]);

  // Track when the InstantSearch query changes to synchronize it with the React state.
  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent updates when typing.
    if (document.activeElement !== inputRef.current && query !== value) {
      setValue(query);
    }
    // We don't want to track when the React state value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Root>
      <ManagerTaskTooltip
        title={
          <MarketplaceOnboardingTask
            name={MarketplaceOnboardingStep.search}
            onClick={() => {
              // setStep();
              setValue(
                favPlayerHit?.display_name || DEFAULT_MARKETPLACE_TASK_SEARCH
              );
              setShouldOpenNextOnboarding(true);
            }}
          />
        }
        placement="bottom-start"
        name={MarketplaceOnboardingStep.search}
        fullWidth
        // disable={!task}
      >
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
      </ManagerTaskTooltip>
    </Root>
  );
};

export default SearchBox;
