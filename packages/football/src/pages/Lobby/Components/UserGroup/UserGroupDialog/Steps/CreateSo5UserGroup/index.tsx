/* eslint-disable jsx-a11y/label-has-associated-control */
import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  So5LeaderboardType,
  So5UserGroup,
} from '@sorare/core/src/__generated__/globalTypes';
import {
  GraphQLResult,
  GraphqlForm,
} from '@sorare/core/src/components/form/Form';
import {
  FOOTBALL_PRIVATE_LEAGUES_CREATED,
  PrivateLeaguesStep,
} from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { glossary } from '@sorare/core/src/lib/glossary';

import AvatarInput from '@football/components/userGroup/form/AvatarInput';
import DescriptionInput from '@football/components/userGroup/form/DescriptionInput';
import NameInput from '@football/components/userGroup/form/NameInput';
import ScoringPeriodInput from '@football/components/userGroup/form/ScoringPeriodInput';
import TournamentInput from '@football/components/userGroup/form/TournamentInput';
import { eligibleTournamentsForUserGroupQuery } from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/Steps/__generated__/queries.graphql';
import { ELIGIBLE_TOURNAMENTS_USERGROUP_QUERY } from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/Steps/queries';

import { So5UpcomingFixtureQuery } from './__generated__/index.graphql';
import useCreateSo5UserGroup from './useCreateSo5UserGroup';

const StyledGraphqlForm = styled(GraphqlForm)`
  height: 100%;
  margin: 0;
`;
const FormWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const ButtonWrapper = styled.div`
  margin-top: auto;
`;

const UPCOMING_FIXTURES_QUERY = gql`
  query So5UpcomingFixtureQuery {
    so5: vicc5Root {
      so5Fixture: vicc5Fixture(type: UPCOMING) {
        slug
        ...ScoringPeriodInput_upcomingFixture
      }
    }
  }
  ${ScoringPeriodInput.fragments.upcomingFixture}
`;

export const CreateSo5UserGroup = () => {
  const createSo5UserGroup = useCreateSo5UserGroup();
  const [logoId, setLogoId] = useState<string>();
  const navigate = useNavigate();

  const { data: eligibleTournamentsData, loading: tournamentsLoading } =
    useQuery<eligibleTournamentsForUserGroupQuery>(
      ELIGIBLE_TOURNAMENTS_USERGROUP_QUERY
    );
  const tournaments =
    eligibleTournamentsData?.football.so5
      .eligibleTournamentTypesForSo5UserGroups;

  const { data: upcomingFixtureData, loading: upcomingFixtureLoading } =
    useQuery<So5UpcomingFixtureQuery>(UPCOMING_FIXTURES_QUERY);
  const upcomingFixture = upcomingFixtureData?.football.so5.so5Fixture;

  const onSelectNewSkin = (id: string) => setLogoId(id);

  const createUserGroup = async (
    {
      displayName,
      description,
      so5LeaderboardType,
      startGameWeek,
      endGameWeek,
    }: {
      displayName: string;
      description: string;
      so5LeaderboardType: So5LeaderboardType;
      startGameWeek: string;
      endGameWeek: string;
    },
    onResult: (result: GraphQLResult) => void
  ) => {
    const { data } = await createSo5UserGroup({
      displayName,
      description,
      so5LeaderboardType,
      logoId,
      startGameWeek: +startGameWeek,
      endGameWeek: endGameWeek === '' ? undefined : +endGameWeek,
    });

    if (data?.createSo5UserGroup) {
      onResult(data?.createSo5UserGroup);
    }
  };

  const onSuccess = (
    result: GraphQLResult & { so5UserGroup?: So5UserGroup }
  ) => {
    const slug = result?.so5UserGroup?.slug;
    if (slug) {
      navigate(
        generatePath(FOOTBALL_PRIVATE_LEAGUES_CREATED, {
          slug,
          step: PrivateLeaguesStep.CONGRATS,
        }),
        {
          replace: true,
        }
      );
    }
  };

  return (
    <StyledGraphqlForm
      onSubmit={(attributes, onResult) => {
        createUserGroup(attributes, onResult);
      }}
      onSuccess={onSuccess}
      render={(Error, SubmitButton) => (
        <FormWrapper>
          <AvatarInput
            onSelectNewSkin={onSelectNewSkin}
            id="newUserGroupInput"
          />
          <NameInput />
          <DescriptionInput />
          {tournaments && <TournamentInput tournaments={tournaments} />}
          {upcomingFixture && (
            <ScoringPeriodInput upcomingFixture={upcomingFixture} />
          )}
          <Error />

          <ButtonWrapper>
            <SubmitButton
              disabled={tournamentsLoading || upcomingFixtureLoading}
              fullWidth
            >
              <FormattedMessage {...glossary.create} />
            </SubmitButton>
          </ButtonWrapper>
        </FormWrapper>
      )}
    />
  );
};
