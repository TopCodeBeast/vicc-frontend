import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Caption, Title4 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { glossary } from '@sorare/core/src/lib/glossary';

import { PrivacyPolicyDialog_dataPartner } from './__generated__/index.graphql';
import useUpdatePartnerOffersAgreement from './useUpdatePartnerOffersAgreement';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--double-unit);
  padding: var(--unit) var(--triple-unit) var(--triple-unit) var(--triple-unit);
`;
const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  gap: var(--unit);
`;
const CenteredTitle4 = styled(Title4)`
  text-align: center;
`;

type Props = {
  onClose: () => void;
  dataPartner: PrivacyPolicyDialog_dataPartner;
};
const PrivacyPolicyDialog = ({
  onClose,
  dataPartner: { slug, name, termsUrl },
}: Props) => {
  const updateAgreement = useUpdatePartnerOffersAgreement();

  const onYes = () => {
    updateAgreement({ partner: slug, value: true });
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
      title={
        <CenteredTitle4>
          <FormattedMessage
            id="Follower.PrivacyPolicyDialog.Title"
            defaultMessage="Trusted partners"
          />
        </CenteredTitle4>
      }
      body={
        <DialogContainer>
          <FormattedMessage
            id="Follower.PrivacyPolicyDialog.Content"
            defaultMessage="Would you like to share your information with {clubName} for marketing and promotional purposes?"
            values={{ clubName: name }}
          />
          <FlexContainer>
            <Button small fullWidth color="red" onClick={onClose}>
              <FormattedMessage {...glossary.no} />
            </Button>
            <Button small fullWidth color="blue" onClick={onYes}>
              <FormattedMessage {...glossary.yes} />
            </Button>
          </FlexContainer>
          <Caption color="var(--c-neutral-500)">
            <FormattedMessage
              id="Follower.PrivacyPolicyDialog.Subcontent"
              defaultMessage="Please note that you will be able to withdraw your consent to the processing of your data by {clubName} at any time. In order to do so, please refer to {clubName} privacy policy <a>here</a>."
              values={{
                clubName: name,
                termsUrl,
                a: (chunks: string[]) => (
                  <a href={termsUrl} target="_blank" rel="noreferrer">
                    {chunks}
                  </a>
                ),
              }}
            />
          </Caption>
        </DialogContainer>
      }
    />
  );
};

PrivacyPolicyDialog.fragments = {
  dataPartner: gql`
    fragment PrivacyPolicyDialog_dataPartner on DataPartner {
      slug
      name
      termsUrl
    }
  `,
};

export default PrivacyPolicyDialog;
