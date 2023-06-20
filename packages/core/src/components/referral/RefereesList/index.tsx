import { gql, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ReferralState } from '__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import Pagination from '@sorare/core/src/atoms/navigation/Pagination';
import { Text18 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from 'contexts/currentUser';

import { RefereeItem } from './RefereeItem';
import {
  RefereesListQuery,
  RefereesListQueryVariables,
} from './__generated__/index.graphql';

export const REFEREES_LIST_QUERY = gql`
  query RefereesListQuery(
    $page: Int
    $pageSize: Int
    $state: ReferralState
    $sport: Sport
  ) {
    currentUser {
      slug
      referrals(
        page: $page
        pageSize: $pageSize
        state: $state
        sport: $sport
      ) {
        id
        pages
        totalCount
        referrals {
          ...RefereeItem_referral
        }
      }
    }
    config {
      id
      referralCampaign {
        id
        cardsCount
      }
    }
  }
  ${RefereeItem.fragments.referral}
`;

const PAGE_SIZE = 10;

type Props = {
  referralState: ReferralState;
};

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Referrals = styled.div`
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);

  & > *:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-300);
  }
`;
const LoadingWrapper = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledPagination = styled.div`
  padding: var(--unit) 0px;
`;
const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
  padding: var(--quadruple-unit);

  & > img {
    width: 40px;
  }
`;

export const RefereesList = (props: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { referralState } = props;
  const [page, setPage] = useState(0);

  const [loadResults, { data, loading }] = useLazyQuery<
    RefereesListQuery,
    RefereesListQueryVariables
  >(REFEREES_LIST_QUERY, {
    variables: {
      pageSize: PAGE_SIZE,
      state: ReferralState.ALL,
    },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setPage(0);
  }, [setPage, referralState]);

  useEffect(() => {
    loadResults({
      variables: {
        page,
        pageSize: PAGE_SIZE,
        state: referralState,
      },
    });
  }, [loadResults, page, referralState]);

  if (!currentUser) return null;

  const myReferrals = data?.currentUser?.referrals;
  const cardsRequirements = data?.config?.referralCampaign?.cardsCount;

  return (
    <Root>
      <Referrals>
        {!loading && myReferrals?.totalCount === 0 && (
          <NoResults>
            <Text18 bold color="var(--c-neutral-600)">
              {!currentUser.referrals.totalCount ? (
                <FormattedMessage
                  id="RefereesList.noInvitationsYet"
                  defaultMessage="No invitations yet"
                />
              ) : (
                <FormattedMessage
                  id="RefereesList.noInvitationsFound"
                  defaultMessage="No invitations found"
                />
              )}
            </Text18>
          </NoResults>
        )}
        {loading && (
          <LoadingWrapper>
            <LoadingIndicator small />
          </LoadingWrapper>
        )}
        {myReferrals?.referrals.map(r => (
          <RefereeItem
            key={r.id}
            refereeItem={r}
            cardsRequirements={cardsRequirements}
          />
        ))}
        {myReferrals && myReferrals.pages > 1 && (
          <StyledPagination>
            <Pagination
              pages={myReferrals.pages}
              currentPage={page}
              onSelect={(pageNumber: number) => setPage(pageNumber)}
            />
          </StyledPagination>
        )}
      </Referrals>
    </Root>
  );
};

export default RefereesList;
