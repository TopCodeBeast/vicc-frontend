import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Header } from '@core/components/carddrop/Layout/Header';
import { StepProps } from '@core/components/carddrop/types';
import { Layout } from '@core/components/cardswap/Layout';
import { CenterVertically } from '@core/components/cardswap/Layout/CenterVertically';
import { glossary } from '@core/lib/glossary';

const YourCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = StepProps;

export const WelcomeToTheTeam = ({ onClose, claimedCard }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Layout
      main={
        <CenterVertically>
          <Header
            title={formatMessage({
              id: 'CardDrop.WelcomeToTheTeam.title2',
              defaultMessage: 'Welcome to the team',
            })}
            subtitle={formatMessage({
              id: 'CardDrop.WelcomeToTheTeam.subtitle',
              defaultMessage: 'Your Card will be available in a few minutes',
            })}
          />
          <YourCard>{claimedCard}</YourCard>
        </CenterVertically>
      }
      footer={
        <Button
          color="white"
          onClick={() => {
            onClose!();
          }}
        >
          {formatMessage(glossary.close)}
        </Button>
      }
    />
  );
};
