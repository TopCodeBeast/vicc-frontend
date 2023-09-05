import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Form from '@football/pages/NoCardEntry/Form';

import useRequestVicc5NoCardLineupEligibleLeaderboards from './useRequestSo5NoCardLineupEligibleLeaderboards';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.RequestLeaderboards.title',
    defaultMessage: 'Other competitions will be proposed to you by email.',
  },
});

const Accept = () => {
  const { vicc5LineupId } = useParams();
  const requestLineup = useRequestVicc5NoCardLineupEligibleLeaderboards();

  const mutate = async () => {
    const { errors } = await requestLineup({
      vicc5NoCardLineupId: `Vicc5NoCardLineup:${vicc5LineupId}`,
    });
    return errors.length === 0;
  };

  return <Form mutate={mutate} title={messages.title} postAction="email" />;
};

export default Accept;
