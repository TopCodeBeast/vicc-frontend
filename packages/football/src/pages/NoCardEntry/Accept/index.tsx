import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Form from '@football/pages/NoCardEntry/Form';

import useAcceptVicc5NoCardLineup from './useAcceptSo5NoCardLineup';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.Accept.title',
    defaultMessage: 'Your team is confirmed.',
  },
  subtitle: {
    id: 'NoCardEntry.Accept.subtitle',
    defaultMessage: 'Please check your emails to select the competition.',
  },
});

const Accept = () => {
  const { vicc5LineupId } = useParams();
  const acceptLineup = useAcceptVicc5NoCardLineup();

  const mutate = async () => {
    const { errors } = await acceptLineup({
      vicc5NoCardLineupId: `Vicc5NoCardLineup:${vicc5LineupId}`,
    });
    return errors.length === 0;
  };

  return (
    <Form mutate={mutate} title={messages.title} subtitle={messages.subtitle} />
  );
};

export default Accept;
