import { createContext, useContext } from 'react';

export interface RegisterFieldOptions {
  onChange: (val: string) => void;
  onError: (err: string | null) => void;
  defaultValue?: string;
}

export const formContext = createContext<{
  registerField: (name: string, options: RegisterFieldOptions) => void;
  handleChange: (name: string) => (event: {
    target: {
      value: string;
    };
  }) => void;
} | null>(null);

export const useFormContext = () => useContext(formContext)!;

export default formContext.Provider;
