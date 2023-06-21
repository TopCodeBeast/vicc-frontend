import { defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

import UpsertCustomDeckDialog from '@core/components/deck/UpsertCustomDeckDialog';
import { FOOTBALL_CUSTOM_DECK_EDIT } from '@core/constants/routes';
import useCreateDeck from '@core/hooks/decks/useCreateDeck';

type Props = {
  open: boolean;
  onClose: () => void;
};
type Variables = { name: string; visible: boolean };

const messages = defineMessages({
  title: {
    id: 'deck.CreateDeckDialog.title',
    defaultMessage: 'Create a new list',
  },
});

export const CreateDeckDialog = ({ onClose, open }: Props) => {
  const createDeck = useCreateDeck();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <UpsertCustomDeckDialog
      open={open}
      submit={async (variables: Variables) => {
        const res = await createDeck(variables);
        if (!res.errors.length) {
          navigate(
            generatePath(FOOTBALL_CUSTOM_DECK_EDIT, {
              name: variables.name,
            }) + location.search || '',
            { state: { backgroundState: location } }
          );
          onClose();
        }
      }}
      onClose={onClose}
      title={messages.title}
    />
  );
};

export default CreateDeckDialog;
