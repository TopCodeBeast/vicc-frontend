import { ChangeEvent, useCallback } from 'react';
// import {
//   useInstantSearch,
//   useToggleRefinement,
// } from 'react-instantsearch-hooks-web';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Switch from '@sorare/core/src/components/search/Switch';
// import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
// import useLifecycle, {
//   LIFECYCLE,
//   Lifecycle,
// } from '@sorare/core/src/hooks/useLifecycle';
// import useEvents from '@sorare/core/src/lib/events/useEvents';
import { FilterWidget, TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

const FILTER = TOGGLE_FILTERS.latestSeasonFilter;

const StyledText16 = styled(Text16)`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);
`;

export const useLatestSeasonLocalStorage = (): [
  boolean,
  (value: boolean) => void
] => {
  // const { currentUser } = useCurrentUserContext();
  // const { update: updateLifecycle } = useLifecycle();
  // const lifecycle = currentUser?.userSettings?.lifecycle as Lifecycle;
  const latestSeasonFilterEnabled = true;//lifecycle?.latestSeasonFilterEnabled ?? true;

  const setLatestSeason = useCallback(
    (value: boolean) => {
      // updateLifecycle(LIFECYCLE.latestSeasonFilterEnabled, value);
    },
    [/*updateLifecycle*/]
  );

  return [latestSeasonFilterEnabled, setLatestSeason];
};

const Filter = () => {
  const { formatMessage } = useIntl();
  // const { value: { isRefined }, refine } = useToggleRefinement({ attribute: FILTER.attribute });
  // const track = useEvents();
  // const { indexUiState } = useInstantSearch();
  const [, setLatestSeason] = useLatestSeasonLocalStorage();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // track('Use Market Filter', {
      //   filterName: FILTER.attribute,
      //   filterValue: event.target.checked.toString(),
      // });

      // refine({ isRefined });
      setLatestSeason(event.target.checked);
    },
    [/*track, refine, isRefined,*/ setLatestSeason]
  );

  // we rather consider the refinement state from the UI
  // so that we don't rely on the Algolia answer to come back to reflect the slider state
  const optimisticRefined = false;//!!indexUiState.toggle?.[FILTER.attribute];

  return (
    <Switch
      checked={optimisticRefined}
      onChange={handleChange}
      label={
        <StyledText16 bold>
          <svg
            width="26"
            height="16"
            viewBox="0 0 26 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="21.7163" cy="4.57059" r="1.14286" fill="#4A484A" />
            <circle cx="24.0007" cy="1.14286" r="1.14286" fill="#4A484A" />
            <circle cx="19.4298" cy="8.00028" r="1.14286" fill="#4A484A" />
            <circle cx="17.1434" cy="11.428" r="1.14286" fill="#4A484A" />
            <circle cx="14.8589" cy="14.8577" r="1.14286" fill="#4A484A" />
            <circle cx="17.1429" cy="4.57059" r="1.14286" fill="#0169FD" />
            <circle cx="19.4293" cy="1.14286" r="1.14286" fill="#0169FD" />
            <circle cx="14.8584" cy="8.00028" r="1.14286" fill="#0169FD" />
            <circle cx="12.572" cy="11.428" r="1.14286" fill="#0169FD" />
            <circle cx="10.2875" cy="14.8577" r="1.14286" fill="#0169FD" />
            <circle cx="12.5714" cy="4.57059" r="1.14286" fill="#CE1614" />
            <circle cx="14.8578" cy="1.14286" r="1.14286" fill="#CE1614" />
            <circle cx="10.2869" cy="8.00028" r="1.14286" fill="#CE1614" />
            <circle cx="8.00046" cy="11.428" r="1.14286" fill="#CE1614" />
            <circle cx="5.71402" cy="14.8577" r="1.14286" fill="#CE1614" />
            <circle cx="8.00187" cy="4.57059" r="1.14286" fill="#FEDB5E" />
            <circle cx="10.2883" cy="1.14286" r="1.14286" fill="#FEDB5E" />
            <circle cx="5.71543" cy="8.00028" r="1.14286" fill="#FEDB5E" />
            <circle cx="3.431" cy="11.428" r="1.14286" fill="#FEDB5E" />
            <circle cx="1.14457" cy="14.8577" r="1.14286" fill="#FEDB5E" />
          </svg>
          {formatMessage(FILTER.label!)}
        </StyledText16>
      }
    />
  );
};

const widget: FilterWidget = {
  key: FILTER.attribute,
  type: 'toggle',
  attribute: FILTER.attribute,
  component: <Filter />,
};

export default widget;
