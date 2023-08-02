import { FormControlLabel } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { KycDocumentRequirement } from '__generated__/globalTypes';
import { NativeSelect } from '@core/atoms/inputs/NativeSelect';
import RadioGroup from '@core/atoms/inputs/RadioGroup';
import Block from '@core/atoms/layout/Block';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text14, Text16, Title3, Title4 } from '@core/atoms/typography';
import { GraphqlForm } from '@core/components/form/Form';
import { useIntlContext } from '@core/contexts/intl';
import { useIntlCountries } from '@core/hooks/useIntlCountries';
import { glossary } from '@core/lib/glossary';

import StepWrapper from '../../StepWrapper';
import { MANGOPAY_PRIVACY_POLICY } from '../../externalLinks';
import { CreateFiatWalletSteps } from '../../type';
import { kycDocumentTypeLabels } from './messages';

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
  height: 100%;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  gap: var(--unit);
  align-items: flex-start;
  margin: 0;

  > * {
    width: 100%;
  }
`;

const LinkInFormattedMessage = styled.a`
  text-decoration: underline;
`;

type Props = {
  issuingCountry?: { value: string; label: string };
  setIssuingCountry: (country: { value: string; label: string }) => void;
  kycDocumentRequirements: KycDocumentRequirement[];
  kycDocumentRequirementsLoading: boolean;
  documentRequirement?: KycDocumentRequirement;
  setDocumentRequirement: (type: KycDocumentRequirement) => void;
  setStep: (step: CreateFiatWalletSteps) => void;
};

export const ChooseDocument = ({
  issuingCountry,
  setIssuingCountry,
  kycDocumentRequirements,
  kycDocumentRequirementsLoading,
  documentRequirement,
  setDocumentRequirement,
  setStep,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const countries = useIntlCountries();

  const documentRequirementsOptions = Object.values(
    kycDocumentRequirements
  ).map(kycDocumentRequirement => {
    return {
      value: kycDocumentRequirement.documentType,
      label: (
        <Text16 color="var(--c-neutral-1000)" bold>
          {formatMessage(
            kycDocumentTypeLabels[kycDocumentRequirement.documentType]
          )}
        </Text16>
      ),
    };
  });

  return (
    <StyledGraphqlForm
      onSuccess={() => {
        setStep(CreateFiatWalletSteps.UPLOAD);
      }}
      onSubmit={(values, onResult) => {
        onResult({});
      }}
      render={(Error, SubmitButton) => (
        <StepWrapper
          setStep={setStep}
          step={CreateFiatWalletSteps.CHOOSE_DOCUMENT}
          submitButton={
            <SubmitButton color="blue" medium disabled={!documentRequirement}>
              <FormattedMessage {...glossary.next} />
            </SubmitButton>
          }
        >
          <Title3>
            <FormattedMessage
              id="createFiatWallet.chooseId.title"
              defaultMessage="Add your ID"
            />
          </Title3>
          <Text14>
            <FormattedMessage
              id="createFiatWallet.chooseId.description"
              defaultMessage="Please provide a government-issued ID to enable cash deposits, withdrawals, and rewards."
            />
          </Text14>
          <Title4>
            <FormattedMessage
              id="createFiatWallet.chooseId.subtitle"
              defaultMessage="Choose an ID type to add"
            />
          </Title4>
          <StyledFormControlLabel
            label={
              <Text16 bold color="var(--c-neutral-1000)">
                <FormattedMessage
                  id="ChooseDocument.issuer"
                  defaultMessage="Issuing country/region"
                />
              </Text16>
            }
            control={
              <NativeSelect
                placeholder={formatMessage({
                  id: 'createFiatWallet.tellUsAboutYou.issuer.placeholder',
                  defaultMessage: 'Select an issuing country/region',
                })}
                fullWidth
                name="country"
                value={issuingCountry?.value ?? ''}
                values={countries}
                onChange={value => {
                  setIssuingCountry(countries.find(c => c.value === value)!);
                }}
              />
            }
            labelPlacement="top"
          />
          {kycDocumentRequirementsLoading ? (
            <LoadingIndicator small />
          ) : (
            <>
              {!!kycDocumentRequirements.length && (
                <StyledFormControlLabel
                  label={null}
                  control={
                    <RadioGroup
                      options={documentRequirementsOptions}
                      value={documentRequirement?.documentType}
                      name="currency"
                      modal
                      border
                      onChange={(value: string) => {
                        const selectedDocumentRequirement =
                          kycDocumentRequirements?.find(
                            requirement => requirement.documentType === value
                          );

                        if (selectedDocumentRequirement) {
                          setDocumentRequirement(selectedDocumentRequirement);
                        }
                      }}
                    />
                  }
                  labelPlacement="top"
                />
              )}
            </>
          )}
          <div>
            <Block>
              <Text14 color="var(--c-neutral-600)">
                <FormattedMessage
                  id="createFiatWallet.uploadId.privacy"
                  defaultMessage="Your ID remains private and will be handled according to Mangopay’s <link>Privacy policy</link>."
                  values={{
                    link: (text: string) => (
                      <LinkInFormattedMessage
                        target="_blank"
                        href={MANGOPAY_PRIVACY_POLICY}
                      >
                        {text}
                      </LinkInFormattedMessage>
                    ),
                  }}
                />
              </Text14>
            </Block>
          </div>
        </StepWrapper>
      )}
    />
  );
};

export default ChooseDocument;
