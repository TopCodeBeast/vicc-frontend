import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Form from '@football/pages/NoCardEntry/Form';

import useCancelSo5NoCardLineup from './useCancelSo5NoCardLineup';

const messages = defineMessages({
  title: {
    id: 'NoCardEntry.Cancel.title',
    defaultMessage: 'A new team will be proposed to you by email.',
  },
});

const NoCardEntryCancel = () => {
  const { so5LineupId } = useParams();
  const cancelLineup = useCancelSo5NoCardLineup();

  const mutate = async () => {
    const { errors } = await cancelLineup({
      so5NoCardLineupId: `So5NoCardLineup:${so5LineupId}`,
    });
    return errors.length === 0;
  };

  return <Form mutate={mutate} title={messages.title} postAction="email" />;
};

export default NoCardEntryCancel;
