import { useCallback, useState } from 'react';

export default <T>(
  doSubmit: (element: T) => Promise<any>,
  selectedId: T | null,
  nextStep: () => void
) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const complete = useCallback(() => {
    if (selectedId !== null) {
      setSubmitting(true);
      doSubmit(selectedId)
        .finally(() => {
          setSubmitting(false);
        })
        .then(() => {
          nextStep();
        });
    }
  }, [selectedId, setSubmitting, nextStep, doSubmit]);
  return { submitting, complete };
};
