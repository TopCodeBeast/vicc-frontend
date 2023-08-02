import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import { KycDocumentRequirement } from '__generated__/globalTypes';
import { FileWithDataURL } from '@core/components/form/UploadFile/useUploadFile';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlCountries } from '@core/hooks/useIntlCountries';

import Review from '../Review';
import { CreateFiatWalletSteps } from '../type';
import ChooseDocument from './ChooseDocument';
import Upload from './Upload';
import {
  KYCDocumentRequirementsQuery,
  KYCDocumentRequirementsQueryVariables,
} from './__generated__/index.graphql';

type Props = {
  currentStep: CreateFiatWalletSteps;
  setStep: (step: CreateFiatWalletSteps) => void;
  onDone: () => void;
};

const KYC_DOCUMENT_REQUIREMENTS_QUERY = gql`
  query KYCDocumentRequirementsQuery($countryCode: String!) {
    mangopay {
      id
      kycDocumentRequirements(countryCode: $countryCode) {
        documentType
        nbPages
      }
    }
  }
` as TypedDocumentNode<
  KYCDocumentRequirementsQuery,
  KYCDocumentRequirementsQueryVariables
>;

export const DocumentCheck = ({ setStep, currentStep, onDone }: Props) => {
  const { fiatWalletAccountable } = useCurrentUserContext();
  const countries = useIntlCountries();

  const currentUserCountryOfResidence = countries.find(
    c => c.value === fiatWalletAccountable?.countryOfResidenceCode
  );

  const [issuingCountry, setIssuingCountry] = useState<
    { value: string; label: string } | undefined
  >(currentUserCountryOfResidence);
  const [kycDocumentRequirements, setKycDocumentRequirements] = useState<
    KycDocumentRequirement[]
  >([]);
  const [documentRequirement, setDocumentRequirement] =
    useState<KycDocumentRequirement>();
  const [frontPage, setFrontPage] = useState<FileWithDataURL>();
  const [backPage, setBackPage] = useState<FileWithDataURL>();

  const [query, { loading }] = useLazyQuery(KYC_DOCUMENT_REQUIREMENTS_QUERY);

  const fetchKycRequirements = useCallback(async () => {
    if (issuingCountry) {
      const result = await query({
        variables: { countryCode: issuingCountry.value },
      });

      if (result.data) {
        const { kycDocumentRequirements: requirements } = result.data.mangopay;
        setKycDocumentRequirements(requirements);
        setDocumentRequirement(requirements[0]);
      }
    }
  }, [issuingCountry, query]);

  useEffect(() => {
    fetchKycRequirements();
  }, [fetchKycRequirements]);

  if (currentStep === CreateFiatWalletSteps.DOCUMENT_UNDER_REVIEW)
    return <Review onClick={onDone} />;

  if (currentStep === CreateFiatWalletSteps.UPLOAD && documentRequirement)
    return (
      <Upload
        documentRequirement={documentRequirement}
        frontPage={frontPage}
        backPage={backPage}
        setFrontPage={setFrontPage}
        setBackPage={setBackPage}
        setStep={setStep}
      />
    );

  return (
    <ChooseDocument
      issuingCountry={issuingCountry}
      setIssuingCountry={setIssuingCountry}
      kycDocumentRequirements={kycDocumentRequirements}
      kycDocumentRequirementsLoading={loading}
      documentRequirement={documentRequirement}
      setDocumentRequirement={setDocumentRequirement}
      setStep={setStep}
    />
  );
};

export default DocumentCheck;
