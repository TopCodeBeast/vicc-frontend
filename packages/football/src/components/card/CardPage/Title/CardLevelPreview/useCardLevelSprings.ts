import { useState } from 'react';
import { useSpring } from '@react-spring/web';

import { percentageToNextLevel } from '@sorare/core/src/lib/cards';

type Card = {
  grade: number;
  xpNeededForCurrentGrade: number;
  xpNeededForNextGrade?: number | null;
  xp: number;
};
const useCardLevelSprings = (card: Card) => {
  const [prevCard, setPrevCard] = useState(card);
  const { xpNeededForCurrentGrade, xp: totalXp } = card;
  const relativeXp = totalXp - xpNeededForCurrentGrade;

  const [iterations, setIterations] = useState({
    count: 0,
    startValue: '0%',
    endValue: `${percentageToNextLevel(card)}%`,
    startXp: 0,
    endXp: card.xpNeededForNextGrade ? relativeXp : totalXp,
    startGrade: card.grade,
    endGrade: card.grade,
    nextlevelXP: card.xpNeededForNextGrade
      ? card.xpNeededForNextGrade - card.xpNeededForCurrentGrade
      : null,
    delay: 0,
    reset: true,
  });
  // Change of card object (grade and xp change after mutation) will trigger the first animation
  if (card !== prevCard) {
    const levelGained = card.grade - prevCard.grade;
    if (levelGained > 0) {
      // Animation of first level up
      setIterations({
        count: levelGained,
        // prevCard is used here to start the animation from the xp value of the card BEFORE the mutation
        startValue: `${percentageToNextLevel(prevCard)}%`,
        endValue: '100%',
        startXp: relativeXp,
        endXp: prevCard.xpNeededForNextGrade
          ? prevCard.xpNeededForNextGrade - prevCard.xpNeededForCurrentGrade
          : prevCard.xp - prevCard.xpNeededForCurrentGrade,
        startGrade: prevCard.grade,
        endGrade: prevCard.grade + 1,
        nextlevelXP: prevCard.xpNeededForNextGrade
          ? prevCard.xpNeededForNextGrade - prevCard.xpNeededForCurrentGrade
          : null,
        delay: 0,
        reset: true,
      });
      setPrevCard(card);
    }
  }

  const [{ size, xp, grade }] = useSpring(
    () => ({
      from: {
        size: iterations.startValue,
        grade: iterations.startGrade,
        xp: iterations.startXp,
      },
      to: {
        size: iterations.endValue,
        grade: iterations.endGrade,
        xp: iterations.endXp,
      },
      config: { tension: 210, friction: 60 },
      delay: iterations.delay,
      reset: iterations.reset,
      onRest: () => {
        if (iterations.count > 1) {
          // Animation of every n level up between the first and last ones
          setIterations(i => ({
            ...i,
            count: iterations.count - 1,
            startValue: '0%',
            endValue: '100%',
            startXp: 0,
            endXp: prevCard.xpNeededForNextGrade
              ? prevCard.xpNeededForNextGrade - prevCard.xpNeededForCurrentGrade
              : prevCard.xp - prevCard.xpNeededForCurrentGrade,
            startGrade: i.endGrade,
            endGrade: i.endGrade + 1,
            delay: 500,
          }));
        } else if (iterations.count === 1) {
          // Animation of last level up
          setIterations(i => ({
            count: 0,
            startValue: !card.xpNeededForNextGrade ? '100%' : '0%',
            endValue: `${percentageToNextLevel(card)}%`,
            startXp: 0,
            endXp: card.xpNeededForNextGrade
              ? prevCard.xp - prevCard.xpNeededForCurrentGrade
              : card.xp,
            startGrade: i.endGrade,
            endGrade: i.endGrade,
            nextlevelXP: card.xpNeededForNextGrade
              ? card.xpNeededForNextGrade - card.xpNeededForCurrentGrade
              : null,
            delay: 500,
            reset: !!card.xpNeededForNextGrade,
          }));
        }
      },
    }),
    [iterations]
  );

  return {
    size,
    xp,
    grade,
    nextlevelXP: iterations.nextlevelXP,
  };
};

export default useCardLevelSprings;
