import { defineMessages } from 'react-intl';

import { KycDocumentType } from '__generated__/globalTypes';

export const kycDocumentTypeLabels = defineMessages<KycDocumentType>({
  [KycDocumentType.DRIVING_LICENSE]: {
    id: 'kycDocumentTypeLabels.drivingLicense',
    defaultMessage: "Driver's license",
  },
  [KycDocumentType.NATIONAL_ID]: {
    id: 'kycDocumentTypeLabels.nationalId',
    defaultMessage: 'National ID',
  },
  [KycDocumentType.PASSPORT]: {
    id: 'kycDocumentTypeLabels.passport',
    defaultMessage: 'Passport',
  },
  [KycDocumentType.NATIONAL_HEALTH_INSURANCE_CARD]: {
    id: 'kycDocumentTypeLabels.nationalHealthInsuranceCard',
    defaultMessage: 'National health insurance card',
  },
  [KycDocumentType.RESIDENCE_PERMIT]: {
    id: 'kycDocumentTypeLabels.residencePermit',
    defaultMessage: 'Residence permit',
  },
  [KycDocumentType.TAX_ID]: {
    id: 'kycDocumentTypeLabels.taxId',
    defaultMessage: 'Tax ID',
  },
});

export const kycDocumentTypeLabelsWithPossessivePronoun =
  defineMessages<KycDocumentType>({
    [KycDocumentType.DRIVING_LICENSE]: {
      id: 'kycDocumentTypeLabels.drivingLicenseWithPossessivePronoun',
      defaultMessage: "your driver's license",
    },
    [KycDocumentType.NATIONAL_ID]: {
      id: 'kycDocumentTypeLabels.nationalIdWithPossessivePronoun',
      defaultMessage: 'your national ID',
    },
    [KycDocumentType.PASSPORT]: {
      id: 'kycDocumentTypeLabels.passportWithPossessivePronoun',
      defaultMessage: 'your passport',
    },
    [KycDocumentType.NATIONAL_HEALTH_INSURANCE_CARD]: {
      id: 'kycDocumentTypeLabels.nationalHealthInsuranceCardWithPossessivePronoun',
      defaultMessage: 'your national health insurance card',
    },
    [KycDocumentType.RESIDENCE_PERMIT]: {
      id: 'kycDocumentTypeLabels.residencePermitWithPossessivePronoun',
      defaultMessage: 'your residence permit',
    },
    [KycDocumentType.TAX_ID]: {
      id: 'kycDocumentTypeLabels.taxIdWithPossessivePronoun',
      defaultMessage: 'your tax ID',
    },
  });
