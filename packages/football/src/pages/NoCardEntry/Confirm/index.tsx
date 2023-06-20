import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import useQueryString from '@sorare/core/src/hooks/useQueryString';

import Form from '@sorare/football/src/pages/NoCardEntry/Form';

import useConfirmSo5NoCardLineup from './useConfirmSo5NoCardLineup';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.Confirm.title',
    defaultMessage:
      'Your team is confirmed and will be submitted in the Game Week!',
  },
});

const Accept = () => {
  const { so5LineupId } = useParams();
  const so5LeaderboardId = useQueryString('so5_leaderboard_id');
  const confirmLineup = useConfirmSo5NoCardLineup();

  const mutate = async () => {
    const { errors } = await confirmLineup({
      so5NoCardLineupId: `So5NoCardLineup:${so5LineupId}`,
      so5LeaderboardId: `So5Leaderboard:${so5LeaderboardId}`,
    });
    return errors.length === 0;
  };

  return <Form mutate={mutate} title={messages.title} postAction="lobby" />;
};

export default Accept;
