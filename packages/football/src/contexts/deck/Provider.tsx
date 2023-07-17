import { ReactNode, Suspense, useState } from 'react';

import { lazy } from '@sorare/core/src/lib/retry';

import DeckContextProvider, { EditedDeck } from '.';

//TODO*****************
// const EditDeckDialog = lazy(async () => import('@football/modales/EditDeckDialog'));

interface Props {
  children: ReactNode;
}

const DeckProvider = ({ children }: Props) => {
  const [editedDeck, setEditedDeck] = useState<EditedDeck>();
  const [callback, setCallback] = useState<() => void | undefined>();

  return (
    <DeckContextProvider
      value={{
        editDeck: (deck, cb) => {
          setEditedDeck(deck);
          if (cb) setCallback(() => cb);
        },
      }}
    >
      {editedDeck && (
        <Suspense fallback={null}>
          <>EditDeckDialog</>
          {/* <EditDeckDialog
            onClose={() => {
              setEditedDeck(undefined);
              setCallback(undefined);
            }}
            onDelete={callback || undefined}
            deck={editedDeck}
          /> */}
        </Suspense>
      )}
      {children}
    </DeckContextProvider>
  );
};

export default DeckProvider;
