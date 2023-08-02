import {
  faAddressCard,
  faCreditCardBlank,
} from '@fortawesome/pro-regular-svg-icons';
import { FormControlLabel } from '@material-ui/core';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { KycDocumentRequirement } from '__generated__/globalTypes';
import { Text16, Title3 } from '@core/atoms/typography';
import { GraphQLResult, GraphqlForm } from '@core/components/form/Form';
import { FileWithDataURL } from '@core/components/form/UploadFile/useUploadFile';

import StepWrapper from '../../StepWrapper';
import { CreateFiatWalletSteps } from '../../type';
import { kycDocumentTypeLabelsWithPossessivePronoun } from '../ChooseDocument/messages';
import UploadInput from '../UploadInput';
import { useValidateFiatWallet } from '../useValidateFiatWallet';

const messages = defineMessages({
  front: {
    id: 'UploadID.front',
    defaultMessage: 'front',
  },
  back: {
    id: 'UploadID.back',
    defaultMessage: 'back',
  },
});

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

type Props = {
  documentRequirement: KycDocumentRequirement;
  frontPage: FileWithDataURL | undefined;
  backPage: FileWithDataURL | undefined;
  setStep: (step: CreateFiatWalletSteps) => void;
  setFrontPage: (file: FileWithDataURL) => void;
  setBackPage: (file: FileWithDataURL) => void;
};

const UploadFileWrapper = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: flex-start;

  > * {
    flex-grow: 1;
    width: 50%;
  }
`;

export const Upload = ({
  documentRequirement,
  frontPage,
  backPage,
  setFrontPage,
  setBackPage,
  setStep,
}: Props) => {
  const { validateFiatWallet, loading } = useValidateFiatWallet();
  const { formatMessage } = useIntl();
  const onSubmit = async (onResult: (result: GraphQLResult) => void) => {
    if (!frontPage) return;
    const result = await validateFiatWallet({
      frontPage: frontPage.file,
      ...(backPage ? { backPage: backPage.file } : {}),
    });
    onResult(result);
  };

  const filesCount = documentRequirement.nbPages;
  const filesUploadedCount = [frontPage, backPage].filter(Boolean).length;

  const formattedDocumentName = formatMessage(
    kycDocumentTypeLabelsWithPossessivePronoun[documentRequirement.documentType]
  );

  return (
    <StyledGraphqlForm
      onSuccess={() => {
        setStep(CreateFiatWalletSteps.DOCUMENT_UNDER_REVIEW);
      }}
      onSubmit={(_, onResult) => {
        onSubmit(onResult);
      }}
      render={(Error, SubmitButton) => (
        <StepWrapper
          setStep={setStep}
          step={CreateFiatWalletSteps.UPLOAD}
          submitButton={
            <SubmitButton
              color="blue"
              medium
              disabled={filesUploadedCount !== filesCount || loading}
            >
              <FormattedMessage
                id="createFiatWallet.uploadID.submit"
                defaultMessage="Submit ID"
              />
            </SubmitButton>
          }
        >
          <Title3>
            <FormattedMessage
              id="createFiatWallet.uploadID.title"
              defaultMessage="Upload {filesCount, plural, one {an image} other {images}} of {documentType}"
              values={{
                documentType: formattedDocumentName,
                filesCount,
              }}
            />
          </Title3>
          <Text16>
            <FormattedMessage
              id="createFiatWallet.uploadID.description"
              defaultMessage="Make sure your photos aren’t blurry and the front of {documentType} clearly shows your face."
              values={{
                documentType: formattedDocumentName,
              }}
            />
          </Text16>
          <Error />
          <UploadFileWrapper>
            <StyledFormControlLabel
              label={null}
              control={
                <UploadInput
                  name="frontPage"
                  documentName={
                    filesCount === 1
                      ? formattedDocumentName
                      : formatMessage(messages.front)
                  }
                  icon={faAddressCard}
                  file={frontPage}
                  setFile={setFrontPage}
                />
              }
              labelPlacement="top"
            />
            {filesCount === 2 && (
              <StyledFormControlLabel
                label={null}
                control={
                  <UploadInput
                    name="backPage"
                    documentName={formatMessage(messages.back)}
                    icon={faCreditCardBlank}
                    file={backPage}
                    setFile={setBackPage}
                  />
                }
                labelPlacement="top"
              />
            )}
          </UploadFileWrapper>
        </StepWrapper>
      )}
    />
  );
};

export default Upload;
