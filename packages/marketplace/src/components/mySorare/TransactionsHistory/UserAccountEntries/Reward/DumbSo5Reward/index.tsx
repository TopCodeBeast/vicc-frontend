import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { AccountEntry } from '@sorare/core/src/components/mySorare/TransactionsHistory/UserAccountEntries/AccountEntry';
import { LOBBY_TABS, goToLobby } from '@sorare/core/src/constants/routes';

import { DumbSo5Reward_userAccountEntry } from './__generated__/index.graphql';

type SO5RewardLink = {
  slug: string;
  leaderboard: string;
  ranking: number | null;
  gameWeek: number;
};
export interface Props {
  userAccountEntry: DumbSo5Reward_userAccountEntry;
  primaryCurrency: Currency;
  link?: SO5RewardLink;
}

const messages = defineMessages({
  title: {
    id: 'TransactionsHistoryReward.title',
    defaultMessage: 'Reward',
  },
  detail: {
    id: 'TransactionsHistoryReward.details',
    defaultMessage:
      'Finished #{ranking} of {leaderboard} - Game Week {gameWeek}',
  },
});

export const DumbSo5Reward = ({
  userAccountEntry,
  link,
  primaryCurrency,
}: Props) => {
  const { formatMessage } = useIntl();
  if (!link)
    return (
      <AccountEntry
        userAccountEntry={userAccountEntry}
        title={formatMessage(messages.title)}
      />
    );
  const { slug, leaderboard, ranking, gameWeek } = link;

  return (
    <AccountEntry
      userAccountEntry={userAccountEntry}
      title={formatMessage(messages.title)}
      primaryCurrency={primaryCurrency}
    >
      <Link to={goToLobby('past', LOBBY_TABS.LEADERBOARD, slug)}>
        <Text14>
          <FormattedMessage
            {...messages.detail}
            values={{
              ranking,
              leaderboard,
              gameWeek,
            }}
          />
        </Text14>
      </Link>
    </AccountEntry>
  );
};

DumbSo5Reward.fragments = {
  userAccountEntry: gql`
    fragment DumbSo5Reward_userAccountEntry on UserAccountEntry {
      id
      ...AccountEntry_userAccountEntry
    }
    ${AccountEntry.fragments.userAccountEntry}
  ` as TypedDocumentNode<DumbSo5Reward_userAccountEntry>,
};

export default DumbSo5Reward;
