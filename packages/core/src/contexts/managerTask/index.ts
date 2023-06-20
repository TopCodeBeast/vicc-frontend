import { createContext, useContext } from 'react';

export enum MarketplaceOnboardingStep {
  menu = 'menu',
  managerSalesLink = 'managerSalesLink',
  search = 'search',
  marketplaceItem = 'marketplaceItem',
  buy = 'buy',
}

export type Task = {
  id: string;
};

export interface ManagerTaskContext {
  step: MarketplaceOnboardingStep | undefined;
  setStep: (step?: MarketplaceOnboardingStep) => void;
  task?: Task;
  setTask: (task?: Task) => void;
  onSuccessCallback?: () => void;
  setOnSuccessCallback: (callback: () => void) => void;
}

export const managerTaskContext = createContext<ManagerTaskContext | null>(
  null
);

export const useManagerTaskContext = () => useContext(managerTaskContext)!;

export default managerTaskContext.Provider;
