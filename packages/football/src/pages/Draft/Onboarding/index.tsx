import { TypedDocumentNode, gql } from '@apollo/client';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import DialogOnboarding from '@sorare/core/src/components/onboarding/Dialog';

import { LeagueHeader } from '@football/components/draft/LeagueHeader';

import { Onboarding1 } from './Steps/Onboarding1';
import { Onboarding2 } from './Steps/Onboarding2';
import { Onboarding_commonDraftCampaign } from './__generated__/index.graphql';

const Content = styled.div`
  display: flex;
  gap: var(--unit);
  flex-direction: column;
  padding: var(--triple-unit) var(--double-unit) var(--double-unit);
  color: var(--c-neutral-1000);
`;

type Props = {
  isOpen: boolean;
  budget: number;
  commonDraftCampaign: Onboarding_commonDraftCampaign;
  onClose: () => void;
};
export const Onboarding = ({
  isOpen,
  budget,
  commonDraftCampaign,
  onClose,
}: Props) => {
  const competition = commonDraftCampaign.competitions[0];
  return (
    <DialogOnboarding
      darkTheme
      open={isOpen}
      steps={[
        ({ onNext }) => (
          <Fragment key="step1">
            <LeagueHeader competition={competition} onNext={onNext}>
              <Onboarding1
                avatarUrl={competition.featuredPlayer?.pictureUrl || ''}
                playerDisplayName={
                  competition.featuredPlayer?.player.displayName || ''
                }
              />
            </LeagueHeader>
            <Content>
              <Title2>
                <FormattedMessage
                  id="Draft.Onboarding.Step1.title"
                  defaultMessage="Build your squad"
                />
              </Title2>
              <Text16>
                <FormattedMessage
                  id="Football.Onboarding.Step1.description"
                  defaultMessage="You have a budget of {budget, number} points to select 8 players for your squad. Every Game Week, you will field a 5 player team to compete in the {leagueName}. You are free to redraft your initial squad until your first Game Week!"
                  values={{
                    leagueName: commonDraftCampaign.displayName,
                    budget,
                  }}
                />
              </Text16>
            </Content>
          </Fragment>
        ),
        ({ onNext }) => (
          <Fragment key="step2">
            <LeagueHeader competition={competition} onNext={onNext}>
              <Onboarding2
                firstPlayerCard={competition.featuredCardPictureUrls?.[0] || ''}
                secondPlayerCard={
                  competition.featuredCardPictureUrls?.[1] || ''
                }
              />
            </LeagueHeader>
            <Content>
              <Title2>
                <FormattedMessage
                  id="Draft.Onboarding.Step3.title"
                  defaultMessage="Win rewards"
                />
              </Title2>
              <Text16>
                <FormattedMessage
                  id="Draft.Onboarding.Step3.description"
                  defaultMessage="Each Game Week, your team's performance will help you win amazing digital trading Card rewards and other great rewards."
                />
              </Text16>
            </Content>
          </Fragment>
        ),
      ]}
      onClose={onClose}
    />
  );
};

Onboarding.fragments = {
  commonDraftCampaign: gql`
    fragment Onboarding_commonDraftCampaign on CommonDraftCampaign {
      slug
      displayName
      competitions {
        slug
        id
        featuredCardPictureUrls
        featuredPlayer {
          # id
          pictureUrl
          player {
            slug
            id
            displayName
          }
        }
        ...LeagueHeader_competition
      }
    }
    ${LeagueHeader.fragments.competition}
  ` as TypedDocumentNode<Onboarding_commonDraftCampaign>,
};
