export type FormatRule = {
  id: string;
  defaultMessage: {
    id: string;
    defaultMessage: string;
  };
  error: any;
  values?: any;
  title?: any;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  requirement?: React.ReactNode;
}

export type RuleHelperFnReturnType = any; //TODO
