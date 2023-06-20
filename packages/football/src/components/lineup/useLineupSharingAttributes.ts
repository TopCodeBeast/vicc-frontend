import { gql } from '@apollo/client';
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
} from 'lib/so5';

import {
  generateLineupSharingTitle_so5Fixture,
  useLineupSharingAttributes_so5Lineup,
} from './__generated__/useLineupSharingAttributes.graphql';

const generateLineupSharingTitle = withFragments(
  (fixture: generateLineupSharingTitle_so5Fixture): MessageDescriptor => {
    const messages = isFixtureStarted(fixture)
      ? startedLineupSharingMessages
      : notStartedLineupSharingMessages;
    return randomElement([messages.set1, messages.set2, messages.set3]);
  },
  {
    so5Fixture: gql`
      fragment generateLineupSharingTitle_so5Fixture on So5Fixture {
        slug
        aasmState
      }
    `,
  }
);

export const useLineupSharingAttributes = (
  so5Lineup?: useLineupSharingAttributes_so5Lineup | null
) => {
  const {
    flags: { enableLineupSharing = false },
  } = useFeatureFlags();
  const { formatMessage } = useIntl();
  const { currentUser } = useCurrentUserContext();

  if (!so5Lineup || !enableLineupSharing) {
    return {};
  }
  return {
    url:
      window.location.origin +
      generatePath(FOOTBALL_LINEUP_SHARING, {
        id: idFromObject(so5Lineup.id),
      }),
    message: formatMessage(generateLineupSharingTitle(so5Lineup.so5Fixture), {
      displayName: so5Lineup.so5Leaderboard?.displayName,
      clubName: currentUser?.profile.clubName,
    }),
    sharedItem: UTM_CAMPAIGNS.LINEUP,
    sharedItemId: idFromObject(so5Lineup.id),
  };
};

useLineupSharingAttributes.fragments = {
  so5Lineup: gql`
    fragment useLineupSharingAttributes_so5Lineup on So5Lineup {
      id
      so5Fixture {
        slug
        aasmState
        ...generateLineupSharingTitle_so5Fixture
      }
      so5Leaderboard {
        slug
        displayName
      }
    }
    ${generateLineupSharingTitle.fragments.so5Fixture}
  `,
};
