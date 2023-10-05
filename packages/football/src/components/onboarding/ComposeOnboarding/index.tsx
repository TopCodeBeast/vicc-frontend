import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text16, Title1 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { LeagueHeader } from '@football/components/draft/LeagueHeader';
import { PickerCard } from '@football/components/draft/PickerCard';

import { ComposeOnboarding_competition } from './__generated__/index.graphql';

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  /* For mobile, ensures buttons are at bottom of screen */
  height: 100%;
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;
const Rows = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--double-unit);
  pointer-events: none;
`;
const PickerRow = styled.div`
  display: flex;
  gap: calc(var(--half-unit) * 3);
  justify-content: center;
`;
const StyledText16 = styled(Text16)`
  margin-top: var(--unit);
  opacity: 0.5;
`;
const Centered = styled.div`
  margin-top: auto;
  padding: var(--triple-unit);
  padding-bottom: var(--double-unit);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Content = styled.div`
  padding: var(--triple-unit);
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  competition?: ComposeOnboarding_competition;
};
export const ComposeOnboarding = ({ isOpen, onClose, competition }: Props) => {
  return (
    <Dialog
      darkTheme
      open={isOpen}
      maxWidth="sm"
      onClose={onClose}
      hideHeader
      body={
        <DialogContent>
          <LeagueHeader
            competition={competition}
            onClose={onClose}
            onNext={onClose}
          >
            <Rows>
              <PickerRow>
                <PickerCard
                  position={Position.Bowler}
                  drafted={{
                    value: 62,
                    avatarUrl: competition?.featuredPlayer?.pictureUrl,
                    player: {
                      displayName:
                        competition?.featuredPlayer?.player.displayName || '',
                    },
                  }}
                />
                <PickerCard position="Extra Player" active />
              </PickerRow>
              <PickerRow>
                <PickerCard position={Position.Fielder} />
                <PickerCard position={Position.Batsman} />
                <PickerCard position={Position.Wicketkeeper} />
              </PickerRow>
            </Rows>
          </LeagueHeader>
          <Content>
            <Title1>
              <FormattedMessage
                id="Draft.ComposeOnboarding.title"
                defaultMessage="Compose your lineup"
              />
            </Title1>
            <StyledText16>
              <FormattedMessage
                id="Draft.ComposeOnboarding.description"
                defaultMessage="Now that you have your squad, let's set your lineup for the first tournament. Pick the players that will score the most in the upcoming Game Week."
              />
            </StyledText16>
            <Centered>
              <Button medium color="blue" onClick={onClose}>
                <FormattedMessage
                  id="Draft.ComposeOnboarding.Compose"
                  defaultMessage="Compose"
                />
              </Button>
            </Centered>
          </Content>
        </DialogContent>
      }
    />
  );
};

ComposeOnboarding.fragments = {
  competition: gql`
    fragment ComposeOnboarding_competition on Competition {
      slug
      id
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
    ${LeagueHeader.fragments.competition}
  ` as TypedDocumentNode<ComposeOnboarding_competition>,
};
