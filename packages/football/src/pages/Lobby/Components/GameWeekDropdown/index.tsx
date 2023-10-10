import { TypedDocumentNode, gql } from '@apollo/client';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { AsyncPaginate } from 'react-select-async-paginate';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import FixtureDateRange from '@sorare/core/src/components/lobby/FixtureDateRange';
import {
  FOOTBALL_LOBBY_LIVE,
  FOOTBALL_LOBBY_PAST,
  FOOTBALL_LOBBY_UPCOMING,
} from '@sorare/core/src/constants/routes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { isFixtureLive, isFixtureOpened } from '@football/lib/so5';

import {
  Lobby_GameWeekDropdownHeader_vicc5Fixture,
  Vicc5FixturesDropdownQuery,
  Vicc5FixturesDropdownQueryVariables,
} from './__generated__/index.graphql';

const styles = {
  control: () => ({
    display: 'flex',
    flexWrap: 'nowrap' as const,
    cursor: 'pointer',
  }),
  indicatorsContainer: () => ({
    position: 'relative' as const,
    display: 'block',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  groupHeading: () => ({
    position: 'sticky' as const,
    top: 0,
    background: 'var(--c-neutral-300)',
    padding: 'var(--double-unit)',
  }),
  group: () => ({
    padding: 0,
  }),
  option: (base: any, state: any) => {
    let backgroundColor = 'var(--c-neutral-200)';
    if (state.isSelected) {
      backgroundColor = 'var(--c-neutral-400)';
    } else if (state.isFocused) {
      backgroundColor = 'var(--c-neutral-400)';
    }
    return {
      ...base,
      backgroundColor,
      color: 'var(--c-neutral-1000)',
      cursor: 'pointer',
      padding: 'var(--intermediate-unit)',
      borderBottom: ` 1px solid var(--c-neutral-300)`,
      '&:last-child': {
        borderBottom: 'none',
      },
      '&:hover': {
        backgroundColor: 'var(--c-neutral-300)',
      },
    };
  },
  menu: (base: any) => ({
    ...base,
    borderRadius: 'var(--double-unit)',
    overflow: 'hidden',
    width: 400,
    maxWidth: `calc(100vw - var(--quadruple-unit))`,
    boxShadow: `0px 10px 60px rgba(0, 0, 0, 0.3);`,
    background: 'var(--c-neutral-200)',
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
    maxHeight: 400,
  }),
  dropdownIndicator: (base: any, state: any) => {
    const {
      selectProps: { menuIsOpen },
    } = state;
    return {
      position: 'absolute' as const,
      color: 'var(--c-neutral-1000)',
      padding: 0,
      right: 'calc(-2 * var(--unit))',
      transition: 'transform 0.25s ease-out',
      transform: menuIsOpen ? 'rotate(-180deg)' : 'none',
    };
  },
};

type Vicc5FixturesDropdownQuery_vicc5_vicc5Fixtures_nodes =
  Vicc5FixturesDropdownQuery['vicc5']['vicc5Fixtures']['nodes'][number];

const vicc5FixtureFragment = gql`
  fragment Lobby_GameWeekDropdownHeader_vicc5Fixture on Vicc5Fixture {
    slug
    gameWeek
    startDate
    endDate
    aasmState
    displayName
    shortDisplayName
  }
` as TypedDocumentNode<Lobby_GameWeekDropdownHeader_vicc5Fixture>;

const SO5_FIXTURES_DROPDOWN_QUERY = gql`
  query Vicc5FixturesDropdownQuery($cursor: String) {
    #football {
      vicc5Root {
        vicc5Fixtures(first: 50, after: $cursor) {
          nodes {
            slug
            ...Lobby_GameWeekDropdownHeader_vicc5Fixture
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    #}
  }
  ${vicc5FixtureFragment}
` as TypedDocumentNode<
  Vicc5FixturesDropdownQuery,
  Vicc5FixturesDropdownQueryVariables
>;

export type GameWeekOptionType = {
  slug: string;
  startDate: ISO8601DateTime;
  endDate: ISO8601DateTime;
  aasmState: string;
  gameWeek: number;
  value: string;
  year: string;
};

export interface GameWeekDropdownProps {
  defaultFixture: Lobby_GameWeekDropdownHeader_vicc5Fixture;
  enabled?: boolean;
}

interface GroupBase {
  readonly options: GameWeekOptionType[];
  readonly label?: string;
}

const GroupHeading = (data: any) => {
  const { label } = data;
  return <Text14 color="var(--c-neutral-600)">{label}</Text14>;
};

const Root = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Gameweek = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Option = (vicc5Fixture: Vicc5FixturesDropdownQuery_vicc5_vicc5Fixtures_nodes) => {
  const { startDate, endDate, shortDisplayName } = vicc5Fixture || {};

  return (
    <Root>
      <Gameweek>
        <Text16 bold>
          <FixtureDateRange startDate={startDate} endDate={endDate} />
        </Text16>
      </Gameweek>
      <Text14 color="var(--c-neutral-600)">{shortDisplayName}</Text14>
    </Root>
  );
};

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
`;
const DummyInput = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;
const StyledDate = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ValueContainer = (props: {
  vicc5Fixture?: Vicc5FixturesDropdownQuery_vicc5_vicc5Fixtures_nodes;
  children?: React.ReactNode;
}) => {
  const { vicc5Fixture, children } = props;
  const { startDate = '', endDate = '' } = vicc5Fixture || {};

  if (!vicc5Fixture) {
    return null;
  }

  const isPast = !isFixtureOpened(vicc5Fixture) && !isFixtureLive(vicc5Fixture);

  return (
    <StyledRoot>
      {/** Only display the input to make the full label clickable without text  */}
      <DummyInput>{children}</DummyInput>
      <StyledDate>
        {startDate?.trim() && endDate?.trim() && (
          <>
            <Text16 bold>
              <FixtureDateRange startDate={startDate} endDate={endDate} />
            </Text16>
            {isPast && <FontAwesomeIcon icon={faAngleDown} />}
          </>
        )}
      </StyledDate>
    </StyledRoot>
  );
};

const formatOption = (node: Lobby_GameWeekDropdownHeader_vicc5Fixture) => ({
  ...node,
  year: new Date(node?.startDate).getFullYear(),
});

const groupNodesBySlug = (
  nodes: Vicc5FixturesDropdownQuery_vicc5_vicc5Fixtures_nodes[]
) => {
  const optionsBySlug: Record<string, any> = {};
  nodes.forEach(node => {
    optionsBySlug[node!.slug] = formatOption(node!);
  });
  return optionsBySlug;
};

const groupOptionsByYear = (
  optionsBySlug: Record<string, GameWeekOptionType>
) => {
  const optionsGroupedByYear: Record<string, GroupBase> = {};
  Object.values(optionsBySlug).forEach(option => {
    optionsGroupedByYear[option.year] =
      optionsGroupedByYear[option.year] ||
      ({
        label: option.year,
        options: [],
      } as GroupBase);
    optionsGroupedByYear[option.year].options.push(option);
  });
  return Object.values(optionsGroupedByYear).reverse();
};

const GameWeekDropdown = ({
  defaultFixture,
  enabled,
}: GameWeekDropdownProps) => {
  const navigate = useNavigate();
  const defaultValue = formatOption(defaultFixture);
  const optionsBySlug = useRef<Record<string, GameWeekOptionType>>({});
  const [defaultOptions, setDefaultOptions] = useState<GroupBase[]>([]);
  const { data, loadMore } = usePaginatedQuery(SO5_FIXTURES_DROPDOWN_QUERY, {
    connection: 'Vicc5FixtureConnection',
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    skip: !enabled,
  });
  const vicc5Fixtures = data?.vicc5.vicc5Fixtures;
  const endCursor = vicc5Fixtures?.pageInfo?.endCursor;
  const hasMore = Boolean(vicc5Fixtures?.pageInfo.hasNextPage);
  const latestGameWeek = vicc5Fixtures?.nodes[0]?.gameWeek;
  const fixturesCount = vicc5Fixtures?.nodes.length || 0;

  const fetchNext = useCallback(() => {
    loadMore(false, { cursor: endCursor });
  }, [endCursor, loadMore]);

  const parseOptions = useCallback<() => GroupBase[]>(() => {
    if (!data?.vicc5.vicc5Fixtures?.nodes) {
      return [];
    }
    optionsBySlug.current = groupNodesBySlug(
      data.vicc5.vicc5Fixtures.nodes
    );
    return groupOptionsByYear(optionsBySlug.current);
  }, [data, optionsBySlug]);

  const loadOptions = useCallback(async () => {
    await fetchNext();
    return {
      options: parseOptions(),
      hasMore,
    };
  }, [fetchNext, parseOptions, hasMore]);

  useEffect(() => {
    if (!latestGameWeek) {
      return;
    }
    (async () => {
      // keep fetching until we have the current fixture in the list
      const offset = latestGameWeek! - (defaultValue?.gameWeek || 0);
      if (offset > fixturesCount) {
        await loadOptions();
      } else {
        setDefaultOptions(parseOptions());
      }
    })();
  }, [
    loadOptions,
    parseOptions,
    fixturesCount,
    defaultValue?.gameWeek,
    latestGameWeek,
  ]);

  if (!defaultValue || !optionsBySlug.current[defaultValue?.slug] || !enabled) {
    return <ValueContainer vicc5Fixture={defaultFixture} />;
  }

  return (
    <AsyncPaginate
      onChange={newValue => {
        if (!newValue) {
          return null;
        }
        if (isFixtureOpened(newValue)) {
          return navigate(generatePath(FOOTBALL_LOBBY_UPCOMING, { tab: '' }!));
        }
        if (isFixtureLive(newValue)) {
          return navigate(
            generatePath(FOOTBALL_LOBBY_LIVE, { tab: 'my-teams' }!)
          );
        }
        return navigate(
          generatePath(FOOTBALL_LOBBY_PAST, {
            tab: 'my-teams',
            slug: newValue!.slug,
          })
        );
      }}
      options={defaultOptions}
      loadOptions={loadOptions}
      reduceOptions={(_, mergedOptions) => mergedOptions}
      defaultValue={defaultValue && optionsBySlug.current[defaultValue?.slug]}
      getOptionValue={({ slug }) => optionsBySlug.current?.[slug]?.slug}
      isLoading={false}
      isSearchable={false}
      styles={styles}
      components={{
        DropdownIndicator: () => null,
        Placeholder: () => null,
        NoOptionsMessage: () => null,
        ValueContainer: p => (
          <ValueContainer {...p} vicc5Fixture={defaultFixture} />
        ),
      }}
      formatGroupLabel={groupProps => <GroupHeading {...groupProps} />}
      formatOptionLabel={(optionsProps: any) => <Option {...optionsProps} />}
    />
  );
};

export default GameWeekDropdown;

GameWeekDropdown.fragments = {
  vicc5Fixture: vicc5FixtureFragment,
};
