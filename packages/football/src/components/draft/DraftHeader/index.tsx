import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import {
  Container,
  FullWidthContainer,
} from '@sorare/core/src/atoms/container';
import { FOOTBALL_HOME } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { draftLabels, glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import BeginnersGuideButton from '@football/components/draft/BeginnersGuideButton';
import { useFootballEvents } from '@football/lib/events';

import { DraftHeader_commonDraftCampaign } from './__generated__/index.graphql';

const Root = styled(FullWidthContainer)<{
  backgroundUrl: string;
  backgroundColor: string;
}>`
  z-index: 0;
  background: linear-gradient(180deg, transparent, var(--c-neutral-100)),
    no-repeat top right/50% url(${({ backgroundUrl }) => backgroundUrl}),
    ${({ backgroundColor }) => backgroundColor};
  @media ${tabletAndAbove} {
    background: linear-gradient(
        180deg,
        transparent 0% 40%,
        var(--c-neutral-100)
      ),
      no-repeat top right/25% url(${({ backgroundUrl }) => backgroundUrl}),
      ${({ backgroundColor }) => backgroundColor};
  }
`;
const StyledContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-template-areas:
    'back logo league-name'
    'back logo title';
  padding: var(--intermediate-unit) 0;
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(2, max-content);
    grid-template-areas:
      'back back'
      'logo league-name'
      'logo title';
    padding: var(--double-unit) 0;
  }
`;
const BackButtonWrapper = styled.div`
  grid-area: back;
  margin-right: var(--unit);
  @media ${tabletAndAbove} {
    margin-bottom: var(--intermediate-unit);
    margin-right: 0;
  }
`;
const DivisionLogo = styled.img`
  width: var(--quadruple-unit);
  grid-area: logo;
  margin-right: var(--unit);

  @media ${tabletAndAbove} {
    width: calc(8 * var(--unit));
  }
`;
const LeagueName = styled.span`
  grid-area: league-name;
  color: rgba(var(--c-rgb-neutral-1000), 0.6);
  font: var(--t-12);
  @media ${tabletAndAbove} {
    font: var(--t-bold) var(--t-14);
  }
`;
const TitleWrapper = styled.div`
  grid-area: title;
  display: flex;
  align-items: center;
  gap: var(--unit);
  --beginners-guide-button-width: calc(5 * var(--unit));
  position: relative;
  padding-right: var(--beginners-guide-button-width);
`;
const Title = styled.h2`
  font: var(--t-bold) var(--t-14-16);

  @media ${tabletAndAbove} {
    font: var(--t-bold) var(--t-32);
  }
`;

type Props = {
  commonDraftCampaign: DraftHeader_commonDraftCampaign;
  showExitCta: boolean;
  isOnboarding: boolean;
};

export const DraftHeader = ({
  commonDraftCampaign,
  showExitCta,
  isOnboarding,
}: Props) => {
  const { formatMessage } = useIntl();
  const track = useFootballEvents();
  const { currentUser } = useCurrentUserContext();
  const onGoBack = useSafePreviousNavigate(FOOTBALL_HOME);

  const { competitions, slug } = commonDraftCampaign;

  const competition = competitions[0];

  return (
    <Root
      backgroundUrl={competition.backgroundPictureUrl || ''}
      backgroundColor={competition.backgroundColor || 'var(--c-neutral-100)'}
    >
      <StyledContainer>
        {showExitCta && (
          <BackButtonWrapper>
            <IconButton small color="white" onClick={onGoBack}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                title={formatMessage(glossary.cancel)}
              />
            </IconButton>
          </BackButtonWrapper>
        )}
        {competition.logoUrl && (
          <DivisionLogo
            src={competition.logoUrl}
            alt={commonDraftCampaign.displayName}
          />
        )}
        <LeagueName>{commonDraftCampaign.displayName}</LeagueName>
        <TitleWrapper>
          <Title>
            <FormattedMessage {...draftLabels.selectYourPlayers} />
          </Title>
          <BeginnersGuideButton
            onTrack={() => {
              track('Click Beginners Guide', {
                campaignSlug: slug,
                isLogged: !!currentUser,
                isOnboarding,
              });
            }}
          />
        </TitleWrapper>
      </StyledContainer>
    </Root>
  );
};

DraftHeader.fragments = {
  commonDraftCampaign: gql`
    fragment DraftHeader_commonDraftCampaign on CommonDraftCampaign {
      slug
      displayName
      competitions {
        slug
        id
        backgroundPictureUrl
        backgroundColor
        logoUrl
      }
    }
  ` as TypedDocumentNode<DraftHeader_commonDraftCampaign>,
};
