import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import useQueryString from '@sorare/core/src/hooks/useQueryString';

import Form from '@football/pages/NoCardEntry/Form';

import useConfirmVicc5NoCardLineup from './useConfirmSo5NoCardLineup';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.Confirm.title',
    defaultMessage:
      'Your team is confirmed and will be submitted in the Game Week!',
  },
});

const Accept = () => {
  const { vicc5LineupId } = useParams();
  const vicc5LeaderboardId = useQueryString('vicc5_leaderboard_id');
  const confirmLineup = useConfirmVicc5NoCardLineup();

  const mutate = async () => {
    const { errors } = await confirmLineup({
      vicc5NoCardLineupId: `Vicc5NoCardLineup:${vicc5LineupId}`,
      vicc5LeaderboardId: `Vicc5Leaderboard:${vicc5LeaderboardId}`,
    });
    return errors.length === 0;
  };

  return <Form mutate={mutate} title={messages.title} postAction="lobby" />;
};

export default Accept;
