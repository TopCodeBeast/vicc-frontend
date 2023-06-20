import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Form from '@sorare/football/src/pages/NoCardEntry/Form';

import useRequestSo5NoCardLineupEligibleLeaderboards from './useRequestSo5NoCardLineupEligibleLeaderboards';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.RequestLeaderboards.title',
    defaultMessage: 'Other competitions will be proposed to you by email.',
  },
});

const Accept = () => {
  const { so5LineupId } = useParams();
  const requestLineup = useRequestSo5NoCardLineupEligibleLeaderboards();

  const mutate = async () => {
    const { errors } = await requestLineup({
      so5NoCardLineupId: `So5NoCardLineup:${so5LineupId}`,
    });
    return errors.length === 0;
  };

  return <Form mutate={mutate} title={messages.title} postAction="email" />;
};

export default Accept;
