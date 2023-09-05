import {
  ComponentType,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Actions } from '@core/atoms/layout/Dialog';
import { Title4, Title5 } from '@core/atoms/typography';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
} from '@core/components/form/Form';
import { GAME_RULES } from '@core/constants/routes';
import { useIntlContext } from '@core/contexts/intl';
import useFetch from '@core/hooks/useFetch';
import useIsVisibleInViewport from '@core/hooks/useIsVisibleInViewport';
import useToggle from '@core/hooks/useToggle';
import { fileUrl } from '@core/lib/gitlab';
import LazyMarkdown from '@core/routing/LazyMarkdown';
import { tabletAndAbove } from '@core/style/mediaQuery';

import AcceptAgeLimit from '../AcceptAgeLimit';
import AcceptTermsAndPrivacyPolicy from '../AcceptTermsAndPrivacyPolicy';
import AcceptanceCheckbox from '../AcceptanceCheckbox';
import AgreeToReceiveOffersFromPartners from '../AgreeToReceiveOffersFromPartners';
import sharedMessages from '../messages';
import { AcceptTermsArgs } from '../useAcceptTerms';

const LinkToGameRules = (s: ReactNode) => (
  <a href={GAME_RULES} target="_blank" rel="noreferrer">
    {s}
  </a>
);

const Scrollable = styled.div`
  overflow: auto;
  max-height: calc(100% - calc(8 * var(--unit)));
  padding: var(--double-unit);
`;
const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin-top: var(--double-unit);
`;
const MarkdownContainer = styled.div`
  min-height: 100vh;
  display: flex;
  @media ${tabletAndAbove} {
    min-height: calc(100% + var(--double-unit));
  }
`;

type EffectiveAcceptTermsArgs = Omit<AcceptTermsArgs, 'tcuToken'>;

interface Props {
  onFormSuccess: (
    acceptedTerms: EffectiveAcceptTermsArgs,
    result: GraphQLResult
  ) => void;
  acceptTerms: (args: EffectiveAcceptTermsArgs) => Promise<GraphQLResult>;
}

const Form = styled(GraphqlForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0;
`;

const messages = defineMessages({
  formTermsTitle: {
    id: 'PromptTermsDialog.formTermsTitle',
    defaultMessage:
      'You must accept the following to proceed with registration:',
  },
  termsDialogTitle: {
    id: 'PromptTermsDialog.termsDialogTitle',
    defaultMessage: 'Terms and Conditions',
  },
  gameRulesLabel: {
    id: 'PromptTermsDialog.gameRuleLabel',
    defaultMessage: 'I agree to the applicable <link>Game Rules</link>',
  },
  formPartnersTitle: {
    id: 'PromptTermsDialog.formPartnersTitle',
    defaultMessage:
      "Please indicate if you agree to share your information with Vicc's partners. This is optional.",
  },
  submit: {
    id: 'PromptTermsDialog.submit',
    defaultMessage: 'Accept',
  },
  scrollToBottom: {
    id: 'PromptTermsDialog.scrollToBottom',
    defaultMessage: 'Scroll to bottom',
  },
});

const TitleSection = styled(Title4)`
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.05em;
`;

export const Title = () => {
  const { formatMessage } = useIntlContext();
  return (
    <TitleSection>{formatMessage(messages.termsDialogTitle)}</TitleSection>
  );
};

const hasAcceptedMandatoryTerms = (acceptanceTerms: EffectiveAcceptTermsArgs) =>
  acceptanceTerms.acceptTerms &&
  acceptanceTerms.acceptAgeLimit &&
  acceptanceTerms.acceptPrivacyPolicy &&
  acceptanceTerms.acceptGameRules;

const Submit = styled(Actions)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-top: 1px solid var(--c-neutral-300);
  background-color: var(--c-neutral-100);
  gap: 10px;
  .isMobileWebviewSignUp & {
    border-right: 1px solid var(--c-neutral-300);
    border-left: 1px solid var(--c-neutral-300);
    border-top-left-radius: var(--quadruple-unit);
    border-top-right-radius: var(--quadruple-unit);
  }
`;

const ReadThroughForm = ({ onFormSuccess, acceptTerms }: Props) => {
  const { formatMessage } = useIntlContext();
  const form = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [
    acceptTermsAndPrivacyPolicyLabel,
    toggleAcceptTermsAndPrivacyPolicyLabel,
  ] = useToggle(false);
  const [acceptAgeLimit, toggleAcceptAgeLimit] = useToggle(false);
  const [acceptGameRules, toggleAcceptGameRules] = useToggle(false);
  const [
    agreedToReceiveOffersFromPartners,
    toggleAgreedToReceiveOffersFromPartners,
  ] = useToggle(false);

  const scrollToBottom = useCallback(() => {
    if (form.current) {
      form.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [form]);

  const formIsVisible = useIsVisibleInViewport({ element: form });

  const data = useFetch(
    fileUrl(
      formatMessage({
        id: 'Terms.path',
        defaultMessage: 'TERMS.md',
      })
    )
  );

  const onError = useCallback(
    (result: GraphQLResult) => {
      if (result?.errors?.length) {
        setError(new Error(formatMessage(sharedMessages.error)));
      }
    },
    [setError, formatMessage]
  );

  const termsInput = useMemo<EffectiveAcceptTermsArgs>(
    () => ({
      acceptTerms: acceptTermsAndPrivacyPolicyLabel,
      acceptAgeLimit,
      acceptPrivacyPolicy: acceptTermsAndPrivacyPolicyLabel,
      acceptGameRules,
      agreedToReceiveOffersFromPartners,
    }),
    [
      acceptGameRules,
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
        onResult({
          error: formatMessage(sharedMessages.error),
          errors: [
            {
              message: formatMessage(sharedMessages.error),
            },
          ],
        });
      }
    },
    [acceptTerms, termsInput, formatMessage]
  );

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
        Error: ComponentType<React.PropsWithChildren<unknown>>,
        SubmitButton: FunctionComponent<
          React.PropsWithChildren<SubmitButtonProps>
        >
      ) => (
        <>
          <Scrollable>
            <MarkdownContainer>
              <LazyMarkdown inModal data={data} skipHtml />
            </MarkdownContainer>
            <Group ref={form}>
              <Title5 style={error ? { color: 'var(--c-red-300)' } : {}}>
                <FormattedMessage {...messages.formTermsTitle} />
              </Title5>
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
              <AcceptanceCheckbox
                name="acceptGameRules"
                value={acceptGameRules}
                onChange={toggleAcceptGameRules}
                label={formatMessage(messages.gameRulesLabel, {
                  link: LinkToGameRules,
                })}
              />
            </Group>
            <Group>
              <Title5>
                <FormattedMessage {...messages.formPartnersTitle} />
              </Title5>
              <AgreeToReceiveOffersFromPartners
                name="agreedToReceiveOffersFromPartners"
                value={agreedToReceiveOffersFromPartners}
                onChange={toggleAgreedToReceiveOffersFromPartners}
              />
            </Group>
          </Scrollable>
          <Submit>
            {!formIsVisible ? (
              <Button color="darkGray" medium onClick={scrollToBottom}>
                <FormattedMessage {...messages.scrollToBottom} />
              </Button>
            ) : (
              <SubmitButton
                color="blue"
                medium
                disabled={!hasAcceptedMandatoryTerms(termsInput)}
              >
                <FormattedMessage {...messages.submit} />
              </SubmitButton>
            )}
          </Submit>
        </>
      )}
    />
  );
};

export default ReadThroughForm;
