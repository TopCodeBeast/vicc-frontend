import {
  Close,
  EnterVerificationCode,
  InputPhoneNumber,
  OpenDialog,
} from './types';

export const openDialog: () => OpenDialog = () => ({
  type: 'open_dialog',
});

export const close: () => Close = () => ({
  type: 'close',
});

export const completed: () => Close = () => ({
  type: 'close',
  successfull: true,
});

export const enterVerificationCode: (
  phoneNumber: string
) => EnterVerificationCode = phoneNumber => ({
  type: 'enter_verification_code',
  phoneNumber,
});

export const inputPhoneNumber: () => InputPhoneNumber = () => ({
  type: 'input_phone_number',
});
