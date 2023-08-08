import { useEffect, useState } from 'react';

const useGetOnboardingCards = (
  cardOptions: any[],
  pickedCardIndexFinder: (card: any) => boolean
) => {
  const [cards, setCards] = useState<any[]>([]);
  const [pickedCardIndex, setPickedCardIndex] = useState<number>(-1);

  useEffect(() => {
    const pickedIndex = cardOptions.findIndex(pickedCardIndexFinder);
    setPickedCardIndex(pickedIndex);
    if (pickedIndex >= 0) {
      const dataCopy = [...cardOptions];
      dataCopy.splice(pickedIndex, 1);
      setCards([cardOptions[pickedIndex], ...dataCopy]);
    } else {
      setCards(cardOptions);
    }
  }, [cardOptions, pickedCardIndexFinder, setCards, setPickedCardIndex]);

  return { cards, pickedCardIndex };
};

export default useGetOnboardingCards;
