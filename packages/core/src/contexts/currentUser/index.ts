import { createContext, useContext } from 'react';

// import {
//   Currency,
//   EnabledWallet,
//   FiatWalletAccount,
// } from '__generated__/globalTypes';
// import { Currency as FiatCurrency } from '@core/lib/fiat';

// import { SignInMutation } from './__generated__/queries.graphql';
import {
  CurrentUserQuery_currentUser,
  CurrentUserQuery_currentUser_userSettings,
} from './types';

// type SignInMutation_signIn = SignInMutation['signIn'];

type UserSettingsWithoutInitialCardDrop = Omit<
  CurrentUserQuery_currentUser_userSettings,
  'initialCardDrop'
>;

export type CurrentUser = Omit<CurrentUserQuery_currentUser, 'userSettings'> & {
  userSettings: UserSettingsWithoutInitialCardDrop;
};

// export interface SignInArgs {
//   email?: string;
//   passwordHash?: string;
//   otpAttempt?: string;
//   otpSessionChallenge?: string;
// }

interface CurrentUserContext {
  currentUser: CurrentUser | null | undefined;
  // fiatCurrency: FiatCurrency;
  // currency: Currency;
  // displayEth: boolean;
  // refetch: () => Promise<any>;
  // signIn: (
  //   args: SignInArgs
  // ) => Promise<SignInMutation_signIn | null | undefined>;
  // blockchainCardsCount: number;
  // fiatWalletAccountable: FiatWalletAccount | null;
  // walletPreferences: {
  //   enabledWallets?: EnabledWallet[];
  //   showEthWallet: boolean;
  //   showFiatWallet: boolean;
  //   onlyShowFiatCurrency: boolean;
  //   hasMigratedAndSetupWallets: boolean;
  // };
}

export const currentUserContext = createContext<CurrentUserContext | null>(
  null
);

export const useCurrentUserContext = () => useContext(currentUserContext)!;

export default currentUserContext.Provider;
