import { createContext, useContext } from 'react';

export interface EditedDeck {
  slug: string;
  name: string;
  visible: boolean;
}

export interface DeckContextType {
  editDeck: (deck: EditedDeck, callback?: () => void) => void;
}

export const deckContext = createContext<DeckContextType | null>(null);

export const useDeckContext = () => useContext(deckContext)!;

export default deckContext.Provider;
