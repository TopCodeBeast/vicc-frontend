import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import CheckboxGroup from '@sorare/core/src/atoms/inputs/CheckboxGroup';
import FilterInDropdown from '@sorare/core/src/components/FilterInDropdown';

import { TeamsFilter_team } from './__generated__/index.graphql';

const TeamImg = styled.img`
  width: calc(3 * var(--unit));
  margin-right: var(--double-unit);
`;

const TeamName = styled.span<{ selected: boolean }>`
  ${({ selected }) =>
    selected &&
    css`
      color: var(--c-neutral-1000);
    `}
`;

type Props = {
  teams: TeamsFilter_team[];
  isMobile?: boolean;
  initiallySelectedTeamSlugs?: string[];
  onChange: (slugs: string[]) => void;
};

export const TeamsFilter = ({
  teams,
  initiallySelectedTeamSlugs = [],
  isMobile = true,
  onChange,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    initiallySelectedTeamSlugs
  );

  const options = teams?.map(team => {
    return {
      label: (
        <div>
          {team.pictureUrl && <TeamImg src={team.pictureUrl} alt="" />}
          <TeamName selected={selectedValues.includes(team.slug)}>
            {team.name}
          </TeamName>
        </div>
      ),
      value: team.slug,
    };
  });
  const onSelectionChange = (newValues: string[]) => {
    setSelectedValues(newValues);
    onChange(newValues);
  };

  const onClearFilter = () => {
    setSelectedValues([]);
    onChange([]);
  };

  return isMobile ? (
    <CheckboxGroup
      options={options}
      selectedValues={selectedValues}
      onChange={onSelectionChange}
      rounded
    />
  ) : (
    <FilterInDropdown
      darkTheme
      buttonLabel={
        <FormattedMessage
          id="TeamsFilter.teams"
          defaultMessage="{nbTeams, plural, =0 {All teams} other {Teams (#)}}"
          values={{
            nbTeams: selectedValues.length,
          }}
        />
      }
      filterSelected={!isMobile && !!selectedValues.length}
      onClearFilter={onClearFilter}
    >
      <CheckboxGroup
        options={options}
        selectedValues={selectedValues}
        onChange={onSelectionChange}
      />
    </FilterInDropdown>
  );
};

export default TeamsFilter;

TeamsFilter.fragments = {
  teams: gql`
    fragment TeamsFilter_team on TeamInterface {
      slug
      name
      pictureUrl
    }
  ` as TypedDocumentNode<TeamsFilter_team>,
};
