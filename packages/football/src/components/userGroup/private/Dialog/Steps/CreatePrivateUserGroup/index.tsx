import { TypedDocumentNode, gql } from '@apollo/client';
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  Vicc5LeaderboardType,
  Vicc5UserGroup,
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
import { ELIGIBLE_TOURNAMENTS_FOR_PRIVATE_USER_GROUP_QUERY } from '@football/components/userGroup/private/Dialog/Steps/queries';

import {
  Vicc5UpcomingFixtureQuery,
  Vicc5UpcomingFixtureQueryVariables,
} from './__generated__/index.graphql';
import useCreatePrivateUserGroup from './useCreatePrivateUserGroup';

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
  query Vicc5UpcomingFixtureQuery {
    #football {
      vicc5 {
        vicc5Fixture(type: UPCOMING) {
          slug
          ...ScoringPeriodInput_upcomingFixture
        }
      }
    #}
  }
  ${ScoringPeriodInput.fragments.upcomingFixture}
` as TypedDocumentNode<
  Vicc5UpcomingFixtureQuery,
  Vicc5UpcomingFixtureQueryVariables
>;

export const CreatePrivateUserGroup = () => {
  const createPrivateUG = useCreatePrivateUserGroup();
  const [logoId, setLogoId] = useState<string>();
  const navigate = useNavigate();

  const { data: eligibleTournamentsData, loading: tournamentsLoading } =
    useQuery(ELIGIBLE_TOURNAMENTS_FOR_PRIVATE_USER_GROUP_QUERY);
  const tournaments =
    eligibleTournamentsData?.football.vicc5
      .eligibleTournamentTypesForVicc5UserGroups;

  const { data: upcomingFixtureData, loading: upcomingFixtureLoading } =
    useQuery(UPCOMING_FIXTURES_QUERY);
  const upcomingFixture = upcomingFixtureData?.football.vicc5.vicc5Fixture;

  const onSelectNewSkin = (id: string) => setLogoId(id);

  const createPrivateUserGroup = async (
    {
      displayName,
      description,
      vicc5LeaderboardType,
      startGameWeek,
      endGameWeek,
    }: {
      displayName: string;
      description: string;
      vicc5LeaderboardType: Vicc5LeaderboardType;
      startGameWeek: string;
      endGameWeek: string;
    },
    onResult: (result: GraphQLResult) => void
  ) => {
    const { data } = await createPrivateUG({
      displayName,
      description,
      vicc5LeaderboardType,
      logoId,
      startGameWeek: +startGameWeek,
      endGameWeek: endGameWeek === '' ? undefined : +endGameWeek,
    });

    if (data?.createVicc5UserGroup) {
      onResult(data?.createVicc5UserGroup);
    }
  };

  const onSuccess = (
    result: GraphQLResult & { vicc5UserGroup?: Vicc5UserGroup }
  ) => {
    const slug = result?.vicc5UserGroup?.slug;
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
        createPrivateUserGroup(attributes, onResult);
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
