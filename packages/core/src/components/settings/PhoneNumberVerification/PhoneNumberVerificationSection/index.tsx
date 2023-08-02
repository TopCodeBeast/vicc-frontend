import { useCallback, useMemo, useReducer } from 'react';

import Dialog from '@core/atoms/layout/Dialog';
import { Input } from '@core/components/form/Form/IntlTelInput';
import useVerifyPhoneNumber, {
  canProceedToVerificationCodeInput,
} from '@core/components/user/VerifyPhoneNumber/useVerifyPhoneNumber';
import { useWalletContext } from '@core/contexts/wallet';

import EnterVerificationCode from '../EnterVerificationCode';
import Header from '../Header';
import PhoneNumberVerificationButton from '../PhoneNumberVerificationButton';
import SendVerificationCode from '../SendVerificationCode';
import messages from '../i18n';
import { close, completed, enterVerificationCode, openDialog } from './actions';
import reducer, { init } from './reducer';
import {
  InputPhoneNumberState,
  InputVerificationCodeState,
  State,
} from './types';

type CurrentUserRequirements = React.ComponentProps<
  typeof SendVerificationCode
>['currentUser'];

interface AddOrChangePhoneNumberProps {
  currentUser: CurrentUserRequirements;
  onClick: () => void;
}

const verificationPhoneSectionReducer = reducer();

const AddOrChangePhoneNumber = ({
  currentUser,
  onClick,
}: AddOrChangePhoneNumberProps) => {
  if (currentUser.phoneNumber) {
    return (
      <>
        <Input phone={currentUser.phoneNumber} noBorder disabled />
        <PhoneNumberVerificationButton
          message={messages.changePhoneNumber}
          onClick={onClick}
        />
      </>
    );
  }
  return (
    <PhoneNumberVerificationButton
      message={messages.addPhoneNumber}
      onClick={onClick}
      color="blue"
    />
  );
};

const isInputPhoneNumberStatus = (
  status: State
): status is InputPhoneNumberState => status.stage === 'input_number';

const isEnterVerificationCodeStatus = (
  status: State
): status is InputVerificationCodeState =>
  status.stage === 'enter_verification_code';

const PhoneNumberVerificationSection = ({
  currentUser,
}: {
  currentUser: CurrentUserRequirements;
}) => {
  const [state, dispatch] = useReducer(
    verificationPhoneSectionReducer,
    {
      currentUser,
    },
    init
  );

  const switchToInputNumber = useCallback(() => {
    dispatch(openDialog());
  }, []);
  const verifyPhoneNumber = useVerifyPhoneNumber();
  const { checkUserPhoneNumberVerificationCodeWithRecovery } =
    useWalletContext();

  const sendVerificationCode = useCallback(
    async (phoneNumber: any) =>
      verifyPhoneNumber(phoneNumber).then(async res => {
        if (canProceedToVerificationCodeInput(res)) {
          dispatch(enterVerificationCode(phoneNumber));
        }
        return Promise.resolve(res || []);
      }),
    [verifyPhoneNumber]
  );

  const submitVerificationCode = useCallback(
    async (verificationCode: any) =>
      checkUserPhoneNumberVerificationCodeWithRecovery(verificationCode).then(
        async res => {
          if (!res || res.length === 0) {
            dispatch(completed());
          }
          return res || [];
        }
      ),
    [checkUserPhoneNumberVerificationCodeWithRecovery]
  );

  const goBackCb = useMemo(() => {
    const { goBack } = state;
    if (goBack) {
      return () => {
        goBack(dispatch);
      };
    }
    return undefined;
  }, [state]);

  const closeCb = useMemo(() => {
    const { close: dialogClose } = state;
    if (dialogClose) {
      return () => {
        dialogClose(dispatch);
      };
    }
    return undefined;
  }, [state]);

  return (
    <>
      <AddOrChangePhoneNumber
        currentUser={currentUser}
        onClick={switchToInputNumber}
      />
      {state.stage !== 'status' && (
        <Dialog
          open
          noDivider
          maxWidth="md"
          header={<Header onBack={goBackCb} onClose={closeCb} />}
        >
          {isInputPhoneNumberStatus(state) && (
            <SendVerificationCode
              currentUser={currentUser}
              sendVerificationCode={sendVerificationCode}
            />
          )}
          {isEnterVerificationCodeStatus(state) && (
            <EnterVerificationCode
              resendVerificationCode={async () =>
                verifyPhoneNumber(state.unverifiedPhoneNumber).then(
                  res => res || []
                )
              }
              phoneNumber={state.unverifiedPhoneNumber}
              submitVerificationCode={submitVerificationCode}
              onCancel={close}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default PhoneNumberVerificationSection;
