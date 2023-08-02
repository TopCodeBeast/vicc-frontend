import { ReactNode, useState } from 'react';

import { FiatCurrency } from '__generated__/globalTypes';

import ChooseCurrency from '../ChooseCurrency';
import TellUsAboutYou, { TellUsAboutYouValue } from '../TellUsAboutYou';
import { CreateFiatWalletSteps } from '../type';
import { useCreateOrUpdateFiatWallet } from '../useCreateOrUpdateFiatWallet';

type Props = {
  unsupportedCountryCta?: ReactNode;
  step: CreateFiatWalletSteps;
  setStep: (step: CreateFiatWalletSteps) => void;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeclarativeForm = ({
  step,
  unsupportedCountryCta,
  setStep,
  onClose,
  onSuccess,
}: Props) => {
  const { create } = useCreateOrUpdateFiatWallet();
  const [tellUsAboutYou, setTellusAboutYou] = useState<
    TellUsAboutYouValue | undefined
  >();

  const { nationalityCode, countryOfResidenceCode, firstName, lastName, dob } =
    tellUsAboutYou || {};
  const [currency, setCurrency] = useState<FiatCurrency | undefined>();
  const [
    mangopayTermsAndConditionsAccepted,
    setMangopayTermsAndConditionsAccepted,
  ] = useState<boolean>(false);

  const formIsIncomplete =
    !nationalityCode ||
    !countryOfResidenceCode ||
    !dob ||
    !currency ||
    !firstName ||
    !lastName ||
    !mangopayTermsAndConditionsAccepted;

  if (step === CreateFiatWalletSteps.TELL_US_ABOUT_YOU) {
    return (
      <TellUsAboutYou
        unsupportedCountryCta={unsupportedCountryCta}
        setStep={setStep}
        presetValues={tellUsAboutYou}
        onSuccess={args => {
          setTellusAboutYou(args);
          setStep(CreateFiatWalletSteps.CHOOSE_CURRENCY);
        }}
        onSubmitWithChoosenCountryNotSupported={onClose}
      />
    );
  }
  return (
    <ChooseCurrency
      presetCurrency={currency}
      presetTerms={mangopayTermsAndConditionsAccepted}
      setStep={setStep}
      onChange={(curr, terms) => {
        setCurrency(curr);
        setMangopayTermsAndConditionsAccepted(terms);
      }}
      onSubmit={async () => {
        if (!formIsIncomplete) {
          const res = await create({
            nationalityCode,
            countryOfResidenceCode,
            dob: dob.toISOString(),
            firstName,
            lastName,
            currency,
            mangopayTermsAndConditionsAccepted,
          });
          return res;
        }
        return {};
      }}
      onSuccess={onSuccess}
    />
  );
};
