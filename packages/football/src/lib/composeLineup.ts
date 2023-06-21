import { defineMessages } from 'react-intl';

const fieldTitleMessages = defineMessages<string>({
  captain: {
    id: 'composeTeam.Field.CaptainTitle',
    defaultMessage: 'Select your captain',
  },
  confirm: {
    id: 'composeTeam.Field.ConfirmLineup',
    defaultMessage: 'Confirm your lineup',
  },
  edit: {
    id: 'composeTeam.Field.EditLineup',
    defaultMessage: 'Edit your lineup',
  },
  compose: {
    id: 'composeTeam.Field.Title',
    defaultMessage: 'Compose your lineup',
  },
});

export const getTitleMessage = (
  isCaptainStep: boolean,
  isConfirmStep: boolean,
  isEdit?: boolean
) => {
  if (isEdit) {
    return fieldTitleMessages.edit;
  }
  if (isCaptainStep) {
    return fieldTitleMessages.captain;
  }
  if (isConfirmStep) {
    return fieldTitleMessages.confirm;
  }
  return fieldTitleMessages.compose;
};
