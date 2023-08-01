import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@sorare/core/src/atoms/buttons/Button';
import { UserGroupCreate } from '@sorare/core/src/atoms/icons/UserGroupCreate';
import { UserGroupJoin } from '@sorare/core/src/atoms/icons/UserGroupJoin';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16, Title4 } from '@sorare/core/src/atoms/typography';
import {
  GraphQLResult,
  GraphqlForm,
  TextField,
} from '@sorare/core/src/components/form/Form';
import {
  FOOTBALL_PRIVATE_LEAGUES_CREATED,
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  PrivateLeaguesStep,
  PrivateLeaguesTab,
} from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { glossary } from '@sorare/core/src/lib/glossary';

import { eligibleTournamentsForUserGroupQuery } from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/Steps/__generated__/queries.graphql';
import { ELIGIBLE_TOURNAMENTS_USERGROUP_QUERY } from '@football/pages/Lobby/Components/UserGroup/UserGroupDialog/Steps/queries';
import { alreadyJoinedUserGroup } from '@football/pages/Lobby/Components/UserGroup/helper';

import { JoinSo5UserGroupMutation } from './__generated__/useJoinSo5UserGroup.graphql';
import useJoinSo5UserGroup from './useJoinSo5UserGroup';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const InviteBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
  padding: var(--triple-unit);
  border: 2px solid var(--c-neutral-300);
  border-radius: var(--double-unit);
  /* height of the fully-loaded block (to minimize layout shift after the content is loaded). */
  min-height: 220px;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-top: var(--unit);
    gap: var(--double-unit);
    margin: 0;
  }
`;
const Title = styled(Title4)`
  display: inline-flex;
  gap: var(--unit);
  svg {
    color: var(--c-brand-600);
  }
`;
const Subtitle = styled(Text16)`
  text-align: center;
  color: var(--c-neutral-600);
`;
const CtaButton = styled(Button)`
  margin-top: var(--double-unit);
`;
const ButtonTextWrapper = styled.div`
  padding: 0 var(--unit);
`;

type Props = {
  next: () => void;
};
const CreateOrJoin = ({ next }: Props) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const joinSo5UserGroup = useJoinSo5UserGroup(true);
  const { data, loading } = useQuery<eligibleTournamentsForUserGroupQuery>(
    ELIGIBLE_TOURNAMENTS_USERGROUP_QUERY
  );

  const onJoin = async (
    input: { joinSecret: string },
    onResult: (result: GraphQLResult) => void,
    onCancel: () => void
  ) => {
    const joinSecret = input?.joinSecret?.trim();
    if (joinSecret) {
      const submitData = await joinSo5UserGroup({ joinSecret });
      onResult(submitData);
    } else {
      onCancel();
    }
  };

  const onJoinSuccess = (
    result: GraphQLResult & { data?: JoinSo5UserGroupMutation }
  ) => {
    const group = result?.data?.joinSo5UserGroup;
    const slug = group?.so5UserGroup?.slug;

    if (alreadyJoinedUserGroup(group?.so5UserGroup?.myMembership?.createdAt)) {
      navigate(
        generatePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS, {
          slug,
          tab: PrivateLeaguesTab.LEAGUE,
        }),
        {
          replace: true,
        }
      );
    } else if (slug) {
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
    <DialogContainer>
      <InviteBlock>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <Title>
              <UserGroupCreate />
              <FormattedMessage
                id="UserGroupDialog.UserGroup.Create.Title"
                defaultMessage="Create a private league"
              />
            </Title>

            {!data?.football.so5.eligibleTournamentTypesForSo5UserGroups
              .length ? (
              <Text16>
                <FormattedMessage
                  id="UserGroupDialog.UserGroup.Create.noTournaments"
                  defaultMessage="Sorry, it is not possible to create private leagues this game week"
                />
              </Text16>
            ) : (
              <>
                <Subtitle>
                  <FormattedMessage
                    id="UserGroupDialog.UserGroup.Create.Subtitle"
                    defaultMessage="Create your own league and invite your friends to compete for top spot"
                  />
                </Subtitle>
                <CtaButton onClick={next} color="blue" medium fullWidth>
                  {formatMessage(glossary.create)}
                </CtaButton>
              </>
            )}
          </>
        )}
      </InviteBlock>
      <InviteBlock>
        <Title>
          <UserGroupJoin />
          <FormattedMessage
            id="UserGroupDialog.UserGroup.Join.Title"
            defaultMessage="Join a league"
          />
        </Title>
        <Subtitle>
          <FormattedMessage
            id="UserGroupDialog.UserGroup.Join.Subtitle"
            defaultMessage="Enter a private league code to join and compete against your friends"
          />
        </Subtitle>
        <GraphqlForm
          onSubmit={(variables, onResult, onCancel) => {
            onJoin(variables, onResult, onCancel);
          }}
          onSuccess={onJoinSuccess}
          render={(Error, SubmitButton) => (
            <>
              <TextField
                name="joinSecret"
                placeholder={formatMessage({
                  id: 'UserGroupDialog.Join.Placeholder',
                  defaultMessage: 'Enter code',
                })}
                onChange={e =>
                  setDisabled(
                    !((e.target as HTMLInputElement).value || '').trim()
                  )
                }
                maxLength={6}
                endAdornment={
                  <SubmitButton color="blue" medium disabled={disabled}>
                    <ButtonTextWrapper>
                      <FormattedMessage
                        id="UserGroupDialog.UserGroup.Join.Cta"
                        defaultMessage="Join"
                      />
                    </ButtonTextWrapper>
                  </SubmitButton>
                }
                required
              />
              <Error />
            </>
          )}
        />
      </InviteBlock>
    </DialogContainer>
  );
};

export default CreateOrJoin;
