import { ReactNode, useRef, useState } from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Caption, Text14, Title6 } from '@core/atoms/typography';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import Select from '@core/components/form/Form/Select';
import UploadFile from '@core/components/form/UploadFile';
import { GoogleReCAPTCHA, ReCAPTCHA } from '@core/components/recaptcha';
import { PRIVACY_POLICY } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--triple-unit);
`;
const DisclaimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const Errors = styled.div`
  display: flex;
  flex-direction: column;
`;
const RequiredFields = styled(Caption)`
  text-align: right;
`;
const PrivacyDisclaimer = styled.div`
  padding: var(--double-unit);
  background: var(--c-neutral-200);
  border-radius: var(--unit);
`;

const NoWrapLink = styled(Link)`
  white-space: nowrap;
`;

const sportOptions = [
  { value: '-', label: '-' },
  { value: 'football', label: 'FOOTBALL' },
  { value: 'mlb', label: 'MLB' },
];

type Props = {
  onSubmit: (
    attributes: any,
    onResult: (res: GraphQLResult) => void
  ) => Promise<void>;
  onSuccess: () => void;
};
export const NoCardEntryForm = ({ onSubmit, onSuccess }: Props) => {
  const { formatMessage } = useIntl();
  const [proofOfResidency, setProofOfResidency] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Record<string, MessageDescriptor> | undefined
  >(undefined);
  const recaptchaRef = useRef<GoogleReCAPTCHA>(null);
  const { currentUser } = useCurrentUserContext();

  const basicValidation = ({
    email,
    username,
    sport,
    gameweek,
  }: Record<string, string>) => {
    const errorMessages: Record<string, MessageDescriptor> = {};
    if (!currentUser) {
      errorMessages.currentUser = {
        id: 'NoCardEntryForm.error.currentUser',
        defaultMessage: 'You must be logged in to enter the contest',
      };
      return errorMessages;
    }
    if (!sport || sport === sportOptions[0].value) {
      errorMessages.sport = {
        id: 'NoCardEntryForm.error.currentUser',
        defaultMessage: 'You must select the sport',
      };
    }
    if (!gameweek || Number.isNaN(+gameweek)) {
      errorMessages.gameweek = {
        id: 'NoCardEntryForm.error.currentUser',
        defaultMessage: 'You must enter a valid Game Week number',
      };
    }

    if (email !== currentUser.email) {
      errorMessages.email = {
        id: 'NoCardEntryForm.error.currentUser',
        defaultMessage: 'The email must be the same as your Vicc account',
      };
    }
    if (username !== currentUser.nickname) {
      errorMessages.username = {
        id: 'NoCardEntryForm.error.currentUser',
        defaultMessage: 'The username must be the same as your Vicc account',
      };
    }
    return errorMessages;
  };

  return (
    <GraphqlForm
      onSubmit={(attributes, onResult, onCancel) => {
        const errorMessages = basicValidation(attributes);
        if (Object.keys(errorMessages).length === 0) {
          recaptchaRef.current?.reset();
          recaptchaRef.current?.executeAsync().then(recaptchaTokenV2 => {
            onSubmit(
              { ...attributes, recaptchaTokenV2, proofOfResidency },
              onResult
            );
          });
        } else {
          onResult({
            errors: errorMessages
              ? Object.entries(errorMessages).map(
                  ([fieldError, errorMessage]) =>
                    ({
                      message: formatMessage(errorMessage),
                      code: fieldError,
                      path: ['', fieldError],
                    } as any)
                )
              : null,
          });
          setErrors(errorMessages);
          onCancel();
        }
      }}
      errorMessages={errors}
      onSuccess={onSuccess}
      render={(Error, SubmitButton) => (
        <Root>
          <PrivacyDisclaimer>
            <Title6>
              <FormattedMessage
                id="NoCardEntryForm.privacyDisclaimerTitle"
                defaultMessage="Privacy disclaimer"
              />
            </Title6>
            <Text14>
              <FormattedMessage
                id="NoCardEntryForm.privacyDisclaimer"
                defaultMessage="Vicc processes the data collected to enable your participation in the current Gameweek and to combat fraud and attempted violations of applicable Terms and Conditions and Rules.
              To learn more about how we handle your personal data and to exercise your rights, see <link>Vicc's Privacy Policy</link>.
              "
                values={{
                  link: (children: ReactNode[]) => (
                    <NoWrapLink
                      target="_blank"
                      rel="noopener noreferrer"
                      to={PRIVACY_POLICY}
                    >
                      {children}
                    </NoWrapLink>
                  ),
                }}
              />
            </Text14>
          </PrivacyDisclaimer>
          <TextField
            name="email"
            label={
              <FormattedMessage
                id="NoCardEntryForm.email"
                defaultMessage="Your email address"
              />
            }
            required
          />
          <TextField
            name="username"
            label={
              <FormattedMessage
                id="NoCardEntryForm.username"
                defaultMessage="Your Vicc username"
              />
            }
            required
          />
          <Select
            id="sport"
            name="sport"
            label={formatMessage({
              id: 'NoCardEntryForm.sport',
              defaultMessage: 'Sport',
            })}
            options={sportOptions}
            required
          />
          <TextField
            name="gameweek"
            label={
              <FormattedMessage
                id="NoCardEntryForm.gameweek"
                defaultMessage="Game Week"
              />
            }
            required
          />
          <TextField
            name="proofOfResidencyName"
            label={
              <FormattedMessage
                id="NoCardEntryForm.proofOfResidency"
                defaultMessage="Proof of residence"
              />
            }
            value={proofOfResidency?.name}
            required
            endAdornment={
              <UploadFile
                name="proofOfResidency"
                currentFileUrl={proofOfResidency?.name || null}
                onChange={fileData => setProofOfResidency(fileData.file)}
                type="application/pdf"
                validExtensions={['.pdf']}
                buttonLabel={
                  <FormattedMessage
                    id="NoCardEntryForm.uploadFile"
                    defaultMessage="Upload a file (pdf, maximum size: 2Mb)"
                  />
                }
              />
            }
          />
          <DisclaimerContainer>
            <Caption>
              <FormattedMessage
                id="NoCardEntryForm.proofOfResidency.disclaimer"
                defaultMessage="Document will be validated at a later stage, additional information may be required for suspicious applications."
              />
            </Caption>
            <Caption>
              <FormattedMessage
                id="NoCardEntryForm.proofOfResidency.details"
                defaultMessage={`Accepted documents:{br}
                               - Telephone bill (including cell phone bill){br}
                               - Electricity or gas bill{br}
                               - Rent receipt (from a social organization or real estate agency) or property title{br}
                               - Water bill{br}
                               - Certificate or invoice of insurance of the accommodation{br}`}
                values={{
                  br: <br />,
                }}
              />
            </Caption>
          </DisclaimerContainer>

          <ReCAPTCHA ref={recaptchaRef} />

          <Errors>
            <Error code />
          </Errors>
          <SubmitButton>
            <FormattedMessage
              id="NoCardEntryForm.Cta.submit"
              defaultMessage="Submit"
            />
          </SubmitButton>
          <RequiredFields>
            <FormattedMessage
              id="NoCardEntryForm.requiredFields"
              defaultMessage="* mandatory fields"
            />
          </RequiredFields>
        </Root>
      )}
    />
  );
};

export default NoCardEntryForm;
