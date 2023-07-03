import { createContext, useContext } from 'react';

export enum MarketplaceOnboardingStep {
  menu = 'menu',
  managerSalesLink = 'managerSalesLink',
  search = 'search',
  marketplaceItem = 'marketplaceItem',
  buy = 'buy',
}
// export enum LearnCompetitionsOnboardingStep {
//   menu = 'learning_competition_menu',
//   lobby = 'learning_competition_lobby',
//   lobby_pro = 'learning_competition_lobby_pro',
//   rewards = 'learning_competition_rewards',
//   requirements = 'learning_competition_requirements',
// }
// export type OnboardingStep =
//   | MarketplaceOnboardingStep
//   | LearnCompetitionsOnboardingStep;

// export type Task = {
//   id: string;
// };

// type ManagerTaskContext = {
//   step: OnboardingStep | undefined;
//   setStep: (step?: OnboardingStep) => void;
//   task?: Task;
//   setTask: (task?: Task) => void;
//   onSuccessCallback?: () => void;
//   setOnSuccessCallback: (callback: () => void) => void;
// };

// export const managerTaskContext = createContext<ManagerTaskContext | null>(
//   null
// );

// export const useManagerTaskContext = () => useContext(managerTaskContext)!;

// export default managerTaskContext.Provider;
