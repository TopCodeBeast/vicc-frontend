import {
  ComponentType,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled, { css } from 'styled-components';

import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import StarBall from '@core/atoms/icons/StarBall';
import { Text14, Title4, Title5 } from '@core/atoms/typography';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
} from '@core/components/form/Form';
import { useIntlContext } from '@core/contexts/intl';
import { messages as walletMessages } from '@core/contexts/wallet/messages';
import useToggle from '@core/hooks/useToggle';
import { glossary } from '@core/lib/glossary';

import AcceptAgeLimit from '../AcceptAgeLimit';
import AcceptTermsAndPrivacyPolicy from '../AcceptTermsAndPrivacyPolicy';
import AgreeToReceiveOffersFromPartners from '../AgreeToReceiveOffersFromPartners';
import { AcceptTermsArgs } from '../useAcceptTerms';

const messages = defineMessages({
  required: {
    id: 'oneMoreThing.required',
    defaultMessage: 'Required',
  },
  optional: {
    id: 'oneMoreThing.optional',
    defaultMessage: 'Optional',
  },
  justOneMoreStep: {
    id: 'oneMoreThing.justOneMoreStep',
    defaultMessage: 'Just One More Step',
  },
});

const TitleSection = styled(Title5)`
  text-align: center;
  padding: 0 24px;
  width: 100%;
`;

export const Title = () => {
  const { formatMessage } = useIntlContext();
  return <TitleSection>{formatMessage(glossary.signup)}</TitleSection>;
};

const Form = styled(GraphqlForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  margin-bottom: 0;
`;

const Section = styled.div`
  margin: 8px 0;
`;

const SorareHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const sectionInError = css`
  border: 2px solid var(--c-red-600);
`;

const AcceptTermsAndPrivacyPolicySection = styled.div<{ error?: boolean }>`
  ${props => (props.error ? sectionInError : '')}
`;

const StyledSorareIcon = styled(StarBall)`
  height: 28px;
`;

const StyledSorareLogo = styled(SorareLogo).attrs({
  variant: 'black',
})`
  height: 16px;
`;
const JustOneMoreStepDiv = styled(Title4)`
  text-align: center;
  margin: 24px;
`;

const ErrorMessage = styled.div`
  color: var(--c-red-600);
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  height: 56px;
  padding: var(--unit);
`;

type EffectiveAcceptTermsArgs = Omit<AcceptTermsArgs, 'tcuToken'>;

interface Props {
  onFormSuccess: (
    acceptedTerms: EffectiveAcceptTermsArgs,
    args: GraphQLResult
  ) => void;
  acceptTerms: (args: EffectiveAcceptTermsArgs) => Promise<GraphQLResult>;
}

const hasAcceptedMandatoryTerms = (terms: EffectiveAcceptTermsArgs) =>
  terms.acceptTerms && terms.acceptAgeLimit && terms.acceptPrivacyPolicy;

const OneMoreStep = ({ onFormSuccess, acceptTerms }: Props) => {
  const { formatMessage } = useIntlContext();
  const [error, setError] = useState<ReactNode | null>(null);
  const [
    acceptTermsAndPrivacyPolicyLabel,
    toggleAcceptTermsAndPrivacyPolicyLabel,
  ] = useToggle(false);
  const [acceptAgeLimit, toggleAcceptAgeLimit] = useToggle(false);
  const [
    agreedToReceiveOffersFromPartners,
    toggleAgreedToReceiveOffersFromPartners,
  ] = useToggle(false);
  const [
    hasAttemptedSubmittingWithoutAccepting,
    setHasAttemptedSubmittingWithoutAccepting,
  ] = useState(false);

  const onError = useCallback(
    (result: GraphQLResult) => {
      if (result?.errors?.length) {
        setError(formatMessage(walletMessages.youMustAcceptTermsAndConditions));
      }
    },
    [setError, formatMessage]
  );

  const termsInput = useMemo<EffectiveAcceptTermsArgs>(
    () => ({
      acceptTerms: acceptTermsAndPrivacyPolicyLabel,
      acceptAgeLimit,
      acceptPrivacyPolicy: acceptTermsAndPrivacyPolicyLabel,
      agreedToReceiveOffersFromPartners,
      acceptGameRules: true, // technically, current terms imply game rules acceptance
    }),
    [
      acceptTermsAndPrivacyPolicyLabel,
      acceptAgeLimit,
      agreedToReceiveOffersFromPartners,
    ]
  );

  const doAcceptTerms = useCallback(
    (values: any, onResult: (result: GraphQLResult) => void) => {
      setError(null);
      if (hasAcceptedMandatoryTerms(termsInput)) {
        acceptTerms(termsInput).then(result => onResult(result));
      } else {
        const youMustAcceptTermsAndConditions = formatMessage(
          walletMessages.youMustAcceptTermsAndConditions
        );
        setHasAttemptedSubmittingWithoutAccepting(true);
        onResult({
          error: youMustAcceptTermsAndConditions,
          errors: [
            {
              message: youMustAcceptTermsAndConditions,
            },
          ],
        });
      }
    },
    [acceptTerms, termsInput, formatMessage]
  );

  const youMustAcceptTermsAndConditions =
    hasAttemptedSubmittingWithoutAccepting &&
    !hasAcceptedMandatoryTerms(termsInput);

  const onSuccess = useCallback(
    (result: GraphQLResult) => onFormSuccess(termsInput, result),
    [onFormSuccess, termsInput]
  );

  return (
    <Form
      onSubmit={doAcceptTerms}
      onSuccess={onSuccess}
      onError={onError}
      render={(
        Error: ComponentType,
        SubmitButton: FunctionComponent<SubmitButtonProps>
      ) => (
        <>
          <SorareHeader>
            <StyledSorareIcon color="currentColor" />
            <StyledSorareLogo />
          </SorareHeader>
          <JustOneMoreStepDiv>
            <FormattedMessage {...messages.justOneMoreStep} />
          </JustOneMoreStepDiv>
          <Text14 bold>
            <FormattedMessage {...messages.required} />
          </Text14>
          <Section>
            <AcceptTermsAndPrivacyPolicySection
              error={youMustAcceptTermsAndConditions}
            >
              <AcceptTermsAndPrivacyPolicy
                name="acceptTermsAndPrivacyPolicyLabel"
                value={acceptTermsAndPrivacyPolicyLabel}
                onChange={toggleAcceptTermsAndPrivacyPolicyLabel}
              />
              <AcceptAgeLimit
                name="acceptAgeLimit"
                value={acceptAgeLimit}
                onChange={toggleAcceptAgeLimit}
              />
            </AcceptTermsAndPrivacyPolicySection>
            {youMustAcceptTermsAndConditions && error && (
              <ErrorMessage>{error}</ErrorMessage>
            )}
          </Section>
          <Text14 bold>
            <FormattedMessage {...messages.optional} />
          </Text14>
          <Section>
            <AgreeToReceiveOffersFromPartners
              name="agreedToReceiveOffersFromPartners"
              value={agreedToReceiveOffersFromPartners}
              onChange={toggleAgreedToReceiveOffersFromPartners}
            />
          </Section>
          <Actions>
            <SubmitButton color="blue" medium fullWidth>
              <FormattedMessage {...glossary.signup} />
            </SubmitButton>
          </Actions>
        </>
      )}
    />
  );
};

export default OneMoreStep;
