import { SendVerificationCodeProps } from '../SendVerificationCode';
import { close, inputPhoneNumber } from './actions';
import {
  ActionType,
  Actions,
  EnterVerificationCode,
  InitialState,
  InputPhoneNumberState,
  InputVerificationCodeState,
  State,
} from './types';

export type CurrentUserRequirements = SendVerificationCodeProps['currentUser'];

interface InitProps {
  currentUser: CurrentUserRequirements;
}

export const init = ({ currentUser }: InitProps): State => {
  return {
    stage: 'status',
    phoneNumber: currentUser.phoneNumber,
    unverifiedPhoneNumber: currentUser.phoneNumberVerificationRequested
      ? currentUser.unverifiedPhoneNumber
      : null,
    goBack: undefined,
  };
};

type ActionHandler = (state: State, action: Actions) => State;

type ActionHandlers = {
  [key in ActionType]: <T extends Actions & { type: key }>(
    state: State,
    action: T
  ) => State;
};

const actionHandlers: ActionHandlers = {
  close: (state, { successfull }): InitialState => {
    const result: InitialState = {
      ...state,
      stage: 'status',
      goBack: undefined,
      close: undefined,
    };
    if (successfull) {
      return {
        ...result,
        phoneNumber: result.unverifiedPhoneNumber,
        unverifiedPhoneNumber: null,
      };
    }
    return result;
  },
  enter_verification_code: (
    state,
    action: EnterVerificationCode
  ): InputVerificationCodeState => {
    return {
      ...state,
      stage: 'enter_verification_code',
      unverifiedPhoneNumber: action.phoneNumber,
      goBack: dispatch => {
        dispatch(inputPhoneNumber());
      },
      close: undefined,
    };
  },
  input_phone_number: (state): InputPhoneNumberState => {
    return {
      ...state,
      stage: 'input_number',
      goBack: undefined,
      close: dispatch => {
        dispatch(close());
      },
    };
  },
  open_dialog: (state): InputPhoneNumberState | InputVerificationCodeState => {
    if (state.unverifiedPhoneNumber) {
      return {
        ...state,
        stage: 'enter_verification_code',
        unverifiedPhoneNumber: state.unverifiedPhoneNumber,
        goBack: dispatch => {
          dispatch(inputPhoneNumber());
        },
        close: undefined,
      };
    }
    return {
      ...state,
      stage: 'input_number',
      goBack: undefined,
      close: dispatch => {
        dispatch(close());
      },
    };
  },
};

export default () => (state: State, action: Actions) => {
  const handler = actionHandlers[action.type] as ActionHandler;
  if (!handler) {
    return state;
  }
  return handler(state, action);
};
