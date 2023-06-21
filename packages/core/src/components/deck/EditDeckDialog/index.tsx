import { defineMessages } from 'react-intl';

import UpsertCustomDeckDialog from '@core/components/deck/UpsertCustomDeckDialog';
import useDeleteDeck from '@core/hooks/decks/useDeleteDeck';
import useEditDeck from '@core/hooks/decks/useEditDeck';

type Props = {
  open: boolean;
  onClose: () => void;
  deck?: { name: string; slug: string; visible: boolean };
  onDelete?: () => void;
};

const messages = defineMessages({
  title: {
    id: 'deck.EditDeckDialog.title',
    defaultMessage: 'Edit your deck',
  },
});

export const EditDeckDialog = ({ onClose, open, deck }: Props) => {
  const editDeck = useEditDeck();
  const deleteDeck = useDeleteDeck();

  return (
    <UpsertCustomDeckDialog
      open={open}
      deck={deck}
      submit={async (variables: { name: string; visible: boolean }) => {
        if (deck) {
          await editDeck(deck, variables);
        }
        onClose();
      }}
      onClose={onClose}
      onDelete={deleteDeck}
      title={messages.title}
    />
  );
};

export default EditDeckDialog;
