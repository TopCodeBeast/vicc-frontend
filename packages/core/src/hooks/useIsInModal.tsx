import { useEffect, useRef, useState } from 'react';

export function useIsInModal() {
  const ref = useRef<HTMLDivElement>(null);

  const [isInModal, setIsInModal] = useState(
    !!ref.current?.closest('[role~="presentation"]')
  );
  useEffect(() => {
    setIsInModal(!!ref.current?.closest('[role~="presentation"]'));
  }, []);

  return [ref, isInModal] as const;
}
