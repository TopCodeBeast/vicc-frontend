export type TokenTransferChildrenProps = {
  validationMessages?: string;
  ConsentMessage?: string;
};

export type TokenTransferValidatorProps = {
  tokens: {
    slug: string;
    sport: string;
  }[];
  children: ({
    validationMessages,
    loading,
  }: {
    validationMessages: any;
    loading: boolean;
  }) => React.ReactNode;
  shouldValidate: boolean;
  transferContext: any;
};
