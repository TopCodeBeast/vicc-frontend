import { TypedDocumentNode, gql } from '@apollo/client';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import Select from '@sorare/core/src/components/form/Form/Select';
import FormLabel from '@sorare/core/src/components/form/FormLabel';

import { FieldWrapper } from '@football/components/userGroup/form/FieldWrapper';

import { TournamentInput_tournaments } from './__generated__/index.graphql';

const SecondaryLabelContent = styled(Text14)`
  padding: 3px 0;
  font-size: 14px;
`;

interface Props {
  tournaments: TournamentInput_tournaments[];
}

const messages = defineMessages({
  tournamentMainLabel: {
    id: 'UserGroups.create.tournamentLabel',
    defaultMessage: 'Tournament scoring',
  },
  tournamentSecondaryLabel1: {
    id: 'UserGroups.create.tournamentSecondaryLabel1',
    defaultMessage: 'Select the tournament you want to compete in.',
  },
});

const INPUT_ID = 'newUserGroupTournament';

export const TournamentInput = ({ tournaments }: Props) => {
  const { formatMessage } = useIntl();
  const options = tournaments.map(({ slug, displayName }) => {
    return {
      value: slug,
      label: displayName,
    };
  });

  return (
    <FieldWrapper>
      <Select
        name="vicc5LeaderboardType"
        id={INPUT_ID}
        options={options}
        initialValue={options[0]}
        isDisabled={options.length === 1}
        label={
          <>
            <FormLabel id={INPUT_ID}>
              {formatMessage(messages.tournamentMainLabel)}
            </FormLabel>
            {options.length > 1 && (
              <SecondaryLabelContent>
                {formatMessage(messages.tournamentSecondaryLabel1)}
              </SecondaryLabelContent>
            )}
          </>
        }
      />
    </FieldWrapper>
  );
};

TournamentInput.fragments = {
  tournaments: gql`
    fragment TournamentInput_tournaments on Vicc5Tournament {
      id
      displayName
      slug
    }
  ` as TypedDocumentNode<TournamentInput_tournaments>,
};

export default TournamentInput;
