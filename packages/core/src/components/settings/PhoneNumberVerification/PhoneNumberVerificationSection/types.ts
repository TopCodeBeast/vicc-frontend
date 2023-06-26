export type Close = {
  type: string;
  successfull?: boolean;
};

export type EnterVerificationCode = {
  type: string;
  phoneNumber: string;
};

export type InputPhoneNumber = {
  type: string;
};

export type OpenDialog = {
  type: string;
};
