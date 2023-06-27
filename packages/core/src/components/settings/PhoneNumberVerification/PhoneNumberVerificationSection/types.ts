export type ActionType = 'close' | 'enter_verification_code' | 'input_phone_number' | 'open_dialog';

export interface Actions {
  type: ActionType;
  successfull?: boolean;
}

export interface Close extends Actions {
  
};

export interface EnterVerificationCode extends Actions {
  phoneNumber?: string;
};

export interface InputPhoneNumber extends Actions {

};

export interface OpenDialog extends Actions {

};


export interface State {
  stage?: string;
  phoneNumber?: string | null;
  unverifiedPhoneNumber?: string;
  goBack?: (dispatch: any) => void;
  close?: (dispatch: any) => void;
}

export interface InitialState extends State {

}

export interface InputPhoneNumberState extends State {

}

export interface InputVerificationCodeState extends State {
}
