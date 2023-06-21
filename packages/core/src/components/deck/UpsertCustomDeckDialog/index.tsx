import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Dialog from '@core/atoms/layout/Dialog';
import Form from '@core/components/deck/Form';
import ButtonWithConfirmDialog from '@core/components/form/ButtonWithConfirmDialog';
import { useIntlContext } from '@core/contexts/intl';
import { glossary } from '@core/lib/glossary';

type Deck = { name: string; slug: string; visible: boolean };
type Props = {
  open: boolean;
  onClose: () => void;
  submit: (deck: Omit<Deck, 'slug'>) => Promise<any>;
  title: MessageDescriptor;
  deck?: Deck;
  onDelete?: (deck: Deck) => Promise<any>;
};

export const UpsertCustomDeckDialog = ({
  open,
  title,
  onClose,
  onDelete,
  submit,
  deck,
}: Props) => {
  const { formatMessage } = useIntlContext();

  const handleSubmit = async ({
    name,
    visible,
  }: {
    name: string;
    visible: boolean;
  }) => submit({ name, visible });

  return (
    <Dialog open={open} onClose={onClose} title={formatMessage(title)}>
      <Form onSubmit={handleSubmit} onSuccess={onClose} deck={deck}>
        {deck && onDelete && (
          <ButtonWithConfirmDialog
            medium
            color="red"
            stroke
            onConfirm={() => {
              onDelete(deck).then(onClose);
            }}
          >
            <FormattedMessage {...glossary.delete} />
          </ButtonWithConfirmDialog>
        )}
      </Form>
    </Dialog>
  );
};

export default UpsertCustomDeckDialog;
