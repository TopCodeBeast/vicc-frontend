export type TokenTransferChildrenProps = {
  validationMessages?: Record<string, React.ReactNode>;
  ConsentMessage?: React.ReactNode;
  loading: boolean;
};

export type TokenTransferValidatorProps = {
  tokens: {
    slug: string;
    sport?: string;
  }[];
  children: (props: TokenTransferChildrenProps) => React.ReactNode;
  shouldValidate?: boolean;
  transferContext: any;
};
