import { ReactNode, useState } from 'react';

import HighlightContextProvider, { OnboardingStep, Task } from '.';

interface Props {
  children: ReactNode;
}

export const HighlightProvider = ({ children }: Props) => {
  const [step, setStep] = useState<OnboardingStep>();
  const [task, setTask] = useState<Task>();
  const [onSuccessCallback, setOnSuccessCallback] = useState<() => void>();

  return (
    <HighlightContextProvider
      value={{
        task,
        setTask,
        step,
        setStep,
        onSuccessCallback,
        setOnSuccessCallback,
      }}
    >
      {children}
    </HighlightContextProvider>
  );
};

export default HighlightProvider;
