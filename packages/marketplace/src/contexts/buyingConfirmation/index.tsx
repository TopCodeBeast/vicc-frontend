import { ReactNode, createContext, useContext } from 'react';

// import { Props as SelectedPaymentMethodForConfirmationProps } from '@marketplace/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
type SelectedPaymentMethodForConfirmationProps = any;

export type BuyConfirmationProviderStateProps = {
  tokenOfferId?: string;
  primaryOfferId?: string;
  payment: SelectedPaymentMethodForConfirmationProps;
  customAmountDisplay?: ReactNode;
};

export interface BuyConfirmationContext {
  setBuyConfirmationProps: (props: BuyConfirmationProviderStateProps) => void;
  setShowBuyingConfirmation: (bool: boolean) => void;
}

export const buyConfirmationContext =
  createContext<BuyConfirmationContext | null>(null);

export const useBuyConfirmationContext = () =>
  useContext(buyConfirmationContext)!;

export default buyConfirmationContext.Provider;
