import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Title2, Title5 } from '@sorare/core/src/atoms/typography';
import { GraphQLResult } from '@sorare/core/src/components/form/Form';
import NoCardEntryForm from '@sorare/core/src/components/noCardEntry/NoCardEntryForm';
import useQueryString from '@sorare/core/src/hooks/useQueryString';

import Header from './Header';
import useGenerateNoCardLineup from './useGenerateSo5NoCardLineup';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const CenteredContainer = styled.div`
  margin-top: var(--triple-unit);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoCardEntry = () => {
  const { vicc5FixtureId } = useParams();
  const accessToken = useQueryString('token');
  const [success, setSuccess] = useState(false);

  const generateNoCardLineup = useGenerateNoCardLineup();

  const onSubmit = async (
    attributes: any,
    onResult: (res: GraphQLResult) => void
  ) => {
    const { recaptchaTokenV2, proofOfResidency } = attributes;
    const result = await generateNoCardLineup({
      vicc5FixtureId: `Vicc5Fixture:${vicc5FixtureId!}`,
      recaptchaTokenV2,
      accessToken: accessToken || '',
      proofOfResidency,
    });
    onResult(result);
  };

  return (
    <Root className="light-theme">
      <Header displayTitle={!success} />
      {success ? (
        <CenteredContainer>
          <Title2>
            <FormattedMessage
              id="NoCardEntryForm.successTitle"
              defaultMessage="Thank you"
            />
          </Title2>
          <Title5>
            <FormattedMessage
              id="NoCardEntryForm.successSubtitle"
              defaultMessage="You will receive an email soon with your team!"
            />
          </Title5>
        </CenteredContainer>
      ) : (
        <NoCardEntryForm
          onSubmit={onSubmit}
          onSuccess={() => setSuccess(true)}
        />
      )}
    </Root>
  );
};

export default NoCardEntry;
