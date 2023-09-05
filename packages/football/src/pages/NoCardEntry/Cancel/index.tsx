import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Form from '@football/pages/NoCardEntry/Form';

import useCancelVicc5NoCardLineup from './useCancelSo5NoCardLineup';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.Cancel.title',
    defaultMessage: 'A new team will be proposed to you by email.',
  },
});

const NoCardEntryCancel = () => {
  const { vicc5LineupId } = useParams();
  const cancelLineup = useCancelVicc5NoCardLineup();

  const mutate = async () => {
    const { errors } = await cancelLineup({
      vicc5NoCardLineupId: `Vicc5NoCardLineup:${vicc5LineupId}`,
    });
    return errors.length === 0;
  };

  return <Form mutate={mutate} title={messages.title} postAction="email" />;
};

export default NoCardEntryCancel;
