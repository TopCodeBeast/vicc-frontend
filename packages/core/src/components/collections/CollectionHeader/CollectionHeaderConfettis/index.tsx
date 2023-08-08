import { memo } from 'react';

import Confetti from '@core/atoms/animations/Confetti';
import useScreenSize from '@core/hooks/device/useScreenSize';

export const CollectionHeaderConfettis = memo(() => {
  const { up: isTablet } = useScreenSize('tablet');

  const power = isTablet ? 20 : 15;
  const leftAngle = isTablet ? 35 : 65;
  const rightAngle = isTablet ? 145 : 115;
  return (
    <Confetti leftAngle={leftAngle} rightAngle={rightAngle} power={power} />
  );
});

CollectionHeaderConfettis.displayName = 'CollectionHeaderConfettis';
