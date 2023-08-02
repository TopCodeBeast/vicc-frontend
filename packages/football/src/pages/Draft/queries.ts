import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';

import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { DraftHeader } from '@football/components/draft/DraftHeader';
import CardItem from '@football/pages/ComposeTeam/Draft/CardItem';

import Card from './Card';
import DraftFilters from './DraftFilters';
import { Onboarding } from './Onboarding';
import { Picker } from './Picker';
import {
  DraftAutofillQuery,
  DraftAutofillQueryVariables,
  DraftQuery,
  DraftQueryVariables,
  DraftSetupQuery,
  DraftSetupQueryVariables,
} from './__generated__/queries.graphql';

type DraftAutofillQuery_so5Leaderboard_commonDraftCampaign_autoPick =
  NonNullable<
    DraftAutofillQuery['football']['so5']['so5Leaderboard']['commonDraftCampaign']
  >['autoPick'][number];

const DRAFT_SETUP_QUERY = gql`
  query DraftSetupQuery($so5LeaderboardSlug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $so5LeaderboardSlug) {
          slug
          commonDraftCampaign {
            slug
            campaignType
            positions
            status
            maxDraftablePlayerValue
            teams {
              ...Filters_team
            }
            draftedPlayers {
              id
              ...DraftCard_draftablePlayer
              ...Picker_draftablePlayer
              ...ComposeTeamDraft_CardItem_draftablePlayer
            }
            ...Picker_commonDraftCampaign
            ...Onboarding_commonDraftCampaign
            ...DraftHeader_commonDraftCampaign
          }
        }
      }
    }
  }
  ${Picker.fragments.commonDraftCampaign}
  ${Picker.fragments.draftablePlayer}
  ${DraftFilters.fragments.teams}
  ${Card.fragments.draftablePlayer}
  ${CardItem.fragments.draftablePlayer}
  ${Onboarding.fragments.commonDraftCampaign}
  ${DraftHeader.fragments.commonDraftCampaign}
` as TypedDocumentNode<DraftSetupQuery, DraftSetupQueryVariables>;

export const useSetupQuery = (slug?: string) => {
  const { data, loading } = useQuery(DRAFT_SETUP_QUERY, {
    variables: { so5LeaderboardSlug: slug || '' },
    skip: !slug,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  return { data, loading };
};

const DRAFT_QUERY = gql`
  query DraftQuery(
    $so5LeaderboardSlug: String!
    $after: String
    $pageSize: Int
    $position: Position!
    $teamSlugs: [String!]
    $value: RangeInput
    $sortType: AvailableDraftPlayersSortInput
    $query: String
    $selectedPrintablePlayerIds: [ID!]
  ) {
    football {
      so5 {
        so5Leaderboard(slug: $so5LeaderboardSlug) {
          slug
          commonDraftCampaign {
            slug
            availablePlayers(
              first: $pageSize
              after: $after
              position: $position
              teamSlugs: $teamSlugs
              value: $value
              sortType: $sortType
              query: $query
              selectedPrintablePlayerIds: $selectedPrintablePlayerIds
            ) {
              nodes {
                id
                ...Picker_draftablePlayer
                ...DraftCard_draftablePlayer
                ...ComposeTeamDraft_CardItem_draftablePlayer
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  }
  ${Picker.fragments.draftablePlayer}
  ${Card.fragments.draftablePlayer}
  ${CardItem.fragments.draftablePlayer}
` as TypedDocumentNode<DraftQuery, DraftQueryVariables>;

export const useDraftQuery = (variables: DraftQueryVariables) => {
  const { data, loading, loadMore } = usePaginatedQuery(DRAFT_QUERY, {
    connection: 'DraftablePlayerConnection',
    variables,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-first',
  });
  const { nodes: availablePlayers = [], pageInfo } =
    data?.football.so5.so5Leaderboard.commonDraftCampaign?.availablePlayers ||
    {};

  return { data: { availablePlayers, pageInfo }, loading, loadMore };
};

const AUTOFILL_QUERY = gql`
  query DraftAutofillQuery(
    $so5LeaderboardSlug: String!
    $selectedPrintablePlayerIds: [ID!]
  ) {
    football {
      so5 {
        so5Leaderboard(slug: $so5LeaderboardSlug) {
          slug
          commonDraftCampaign {
            slug
            ...Picker_commonDraftCampaignAutoPick
            autoPick(selectedPrintablePlayerIds: $selectedPrintablePlayerIds) {
              id
              ...DraftCard_draftablePlayer
              ...ComposeTeamDraft_CardItem_draftablePlayer
            }
          }
        }
      }
    }
  }
  ${Picker.fragments.commonDraftCampaignAutoPick}
  ${Card.fragments.draftablePlayer}
  ${CardItem.fragments.draftablePlayer}
` as TypedDocumentNode<DraftAutofillQuery, DraftAutofillQueryVariables>;

export const useAutoFillQuery = ({
  so5LeaderboardSlug,
  onCompleted,
}: {
  so5LeaderboardSlug: string;
  onCompleted?: (
    autoPick: DraftAutofillQuery_so5Leaderboard_commonDraftCampaign_autoPick[]
  ) => void;
}) => {
  return useLazyQuery<DraftAutofillQuery, DraftAutofillQueryVariables>(
    AUTOFILL_QUERY,
    {
      variables: { so5LeaderboardSlug },
      onCompleted: autoFillData => {
        const { autoPick } =
          autoFillData?.football.so5.so5Leaderboard.commonDraftCampaign || {};
        if (autoPick && onCompleted) {
          onCompleted(autoPick);
        }
      },
      fetchPolicy: 'network-only',
    }
  );
};
