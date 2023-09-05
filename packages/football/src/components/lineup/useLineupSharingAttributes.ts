import { TypedDocumentNode, gql } from '@apollo/client';
import { MessageDescriptor, useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';

import { FOOTBALL_LINEUP_SHARING } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { UTM_CAMPAIGNS } from '@sorare/core/src/hooks/useUtmParams';
import { randomElement } from '@sorare/core/src/lib/arrays';
import { withFragments } from '@sorare/core/src/lib/gql';

import {
  isFixtureStarted,
  notStartedLineupSharingMessages,
  startedLineupSharingMessages,
} from '@football/lib/so5';

import {
  generateLineupSharingTitle_vicc5Fixture,
  useLineupSharingAttributes_vicc5Lineup,
} from './__generated__/useLineupSharingAttributes.graphql';

const generateLineupSharingTitle = withFragments(
  (fixture: generateLineupSharingTitle_vicc5Fixture): MessageDescriptor => {
    const messages = isFixtureStarted(fixture)
      ? startedLineupSharingMessages
      : notStartedLineupSharingMessages;
    return randomElement([messages.set1, messages.set2, messages.set3]);
  },
  {
    vicc5Fixture: gql`
      fragment generateLineupSharingTitle_vicc5Fixture on Vicc5Fixture {
        slug
        aasmState
      }
    ` as TypedDocumentNode<generateLineupSharingTitle_vicc5Fixture>,
  }
);

export const useLineupSharingAttributes = (
  vicc5Lineup?: useLineupSharingAttributes_vicc5Lineup | null
) => {
  const {
    flags: { enableLineupSharing = false },
  } = useFeatureFlags();
  const { formatMessage } = useIntl();
  const { currentUser } = useCurrentUserContext();

  if (!vicc5Lineup || !enableLineupSharing) {
    return {};
  }
  return {
    url:
      window.location.origin +
      generatePath(FOOTBALL_LINEUP_SHARING, {
        id: idFromObject(vicc5Lineup.id),
      }),
    message: formatMessage(generateLineupSharingTitle(vicc5Lineup.vicc5Fixture), {
      displayName: vicc5Lineup.vicc5Leaderboard?.displayName,
      clubName: currentUser?.profile.clubName,
    }),
    sharedItem: UTM_CAMPAIGNS.LINEUP,
    sharedItemId: idFromObject(vicc5Lineup.id),
  };
};

useLineupSharingAttributes.fragments = {
  vicc5Lineup: gql`
    fragment useLineupSharingAttributes_vicc5Lineup on Vicc5Lineup {
      id
      vicc5Fixture {
        slug
        aasmState
        ...generateLineupSharingTitle_vicc5Fixture
      }
      vicc5Leaderboard {
        slug
        displayName
      }
    }
    ${generateLineupSharingTitle.fragments.vicc5Fixture}
  ` as TypedDocumentNode<useLineupSharingAttributes_vicc5Lineup>,
};
