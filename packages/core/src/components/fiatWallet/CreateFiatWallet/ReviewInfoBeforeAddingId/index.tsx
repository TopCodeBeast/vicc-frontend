import { useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title3 } from '@core/atoms/typography';
import IntlDate from '@core/components/IntlDate';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { glossary } from '@core/lib/glossary';

import { CreateFiatWalletSteps } from '../type';
import { useCreateOrUpdateFiatWallet } from '../useCreateOrUpdateFiatWallet';
import { useIsNotMajor } from '../useIsNotMajor';
import { EditableRow } from './EditableRow';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const Actions = styled.div`
  margin-top: var(--double-unit);
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
  height: 100%;
`;

const Label = styled(Text16)`
  color: var(--c-neutral-1000);
`;

type Props = {
  setStep: (step: CreateFiatWalletSteps) => void;
};

export const ReviewInfoBeforeAddingId = ({ setStep }: Props) => {
  const { update } = useCreateOrUpdateFiatWallet();

  const { fiatWalletAccountable } = useCurrentUserContext();
  const { firstName, lastName, dob } = fiatWalletAccountable || {};

  // Dob should be not null at this step.
  const [year, month, day] = dob ? dob.split('-').map(Number) : [1990, 0, 1];

  const [newDob, setNewDob] = useState<Date>(
    new Date(Date.UTC(year, month - 1, day))
  );
  const [newFirstName, setNewFirstName] = useState<string>(firstName || '');
  const [newLastName, setNewLastName] = useState<string>(lastName || '');

  const updateAndSubmit = async (onResult: (result: GraphQLResult) => void) => {
    const newIsoDob = newDob.toISOString();
    const newData = {
      firstName: newFirstName,
      lastName: newLastName,
      dob: newIsoDob,
    };
    if (
      firstName !== newFirstName ||
      lastName !== newLastName ||
      (dob && newIsoDob !== new Date(dob).toISOString())
    ) {
      const updateResult = await update(newData);

      onResult(updateResult);
    }
    setStep(CreateFiatWalletSteps.CHOOSE_DOCUMENT);
  };

  const isNotMajor = useIsNotMajor(newDob);

  const disabled = isNotMajor || newFirstName === '' || newLastName === '';

  return (
    <>
      <Title3>
        <FormattedMessage
          id="CreateFiatWallet.ReviewInfo.edit.title"
          defaultMessage="Before adding your ID, review your personal info"
        />
      </Title3>
      <Text16>
        <FormattedMessage
          id="CreateFiatWallet.ReviewInfo.edit.description"
          defaultMessage="Please review the info below for accuracy so we can verify your identity. Your ID should match the personal info in your Sorare account."
        />
      </Text16>
      <StyledGraphqlForm
        onSubmit={(variables, onResult) => {
          updateAndSubmit(onResult);
        }}
        onSuccess={() => {
          setStep(CreateFiatWalletSteps.CHOOSE_DOCUMENT);
        }}
        render={(Error, SubmitButton) => (
          <Content>
            <Rows>
              <EditableRow
                value={newFirstName}
                label={
                  <Label>
                    <FormattedMessage {...glossary.firstName} />
                  </Label>
                }
              >
                <TextField
                  autoFocus
                  name="firstName"
                  defaultValue={newFirstName}
                  onChange={event => setNewFirstName(event?.target.value)}
                />
              </EditableRow>
              <EditableRow
                value={newLastName}
                label={
                  <Label>
                    <FormattedMessage {...glossary.lastName} />
                  </Label>
                }
              >
                <TextField
                  autoFocus
                  name="lastName"
                  onChange={event => {
                    setNewLastName(event?.target.value);
                  }}
                  defaultValue={newLastName}
                />
              </EditableRow>
              <EditableRow
                value={
                  <FormattedDate
                    value={dob}
                    timeZone="UTC"
                    day="numeric"
                    month="long"
                    year="numeric"
                  />
                }
                label={
                  <Label>
                    <FormattedMessage {...glossary.dateOfBirth} />
                  </Label>
                }
              >
                <IntlDate
                  value={newDob}
                  onChange={date => {
                    setNewDob(date);
                  }}
                />
              </EditableRow>
              {isNotMajor && (
                <Text14 color="var(--c-red-600)">
                  <FormattedMessage {...glossary.notMajorError} />
                </Text14>
              )}
            </Rows>
            <Error />
            <Actions>
              <Error />
              <SubmitButton fullWidth color="blue" medium disabled={disabled}>
                <FormattedMessage {...glossary.next} />
              </SubmitButton>
            </Actions>
          </Content>
        )}
      />
    </>
  );
};

export default ReviewInfoBeforeAddingId;
