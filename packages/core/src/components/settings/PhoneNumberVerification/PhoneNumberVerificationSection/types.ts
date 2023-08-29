export type Close = any;
export type EnterVerificationCode = any;
export type InputPhoneNumber = any;
export type OpenDialog = any;
export type InputPhoneNumberState = any;
export type InputVerificationCodeState = any;
export type State = any;

export type InitialState = {
  stage: any;
  phoneNumber: any;
  unverifiedPhoneNumber: any;
  goBack: any;
  close: any;
};

export type ActionType =
  | 'close'
  | 'enter_verification_code'
  | 'input_phone_number'
  | 'open_dialog';

export type Actions = {
  type: string;
  successfull: boolean;
};
