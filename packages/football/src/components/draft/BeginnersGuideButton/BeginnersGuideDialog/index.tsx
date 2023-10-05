import { FormattedMessage, defineMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Title4 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import BulletPoints from './BulletPoints';
import Section from './Section';
import Ball from './assets/ball.png';
import Crown from './assets/crown.png';
import Medal from './assets/medal.png';
import Star from './assets/star.png';
import Trophy from './assets/trophy.png';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--double-unit);
  padding: var(--unit) var(--triple-unit) var(--triple-unit) var(--triple-unit);
  text-align: center;
  @media ${laptopAndAbove} {
    width: 480px;
  }
`;
const CenteredTitle4 = styled(Title4)`
  text-align: center;
`;
const GuideIcon = styled.img`
  width: 40px;
  height: 40px;
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  onClose: () => void;
};
const BeginnersGuideDialog = ({ onClose }: Props) => {
  return (
    <Dialog
      darkTheme
      open
      maxWidth="sm"
      onClose={onClose}
      title={
        <CenteredTitle4>
          <FormattedMessage
            id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Title"
            defaultMessage="Beginners’ Guide"
          />
        </CenteredTitle4>
      }
      body={
        <DialogContainer>
          <Text14>
            <FormattedMessage
              id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Subtitle"
              defaultMessage="Level up your knowledge and become the best Vicc manager."
            />
          </Text14>

          <Section
            icon={<GuideIcon src={Crown} alt="" />}
            title={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.HowToPlay.Title"
                defaultMessage="How Vicc Works"
              />
            }
            subtitle={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.HowToPlay.Subtitle"
                defaultMessage="What makes it special?"
              />
            }
          >
            <FormattedMessage
              id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.HowToPlay.Content"
              defaultMessage="Vicc is a revolutionary fantasy football game transforming fans into owners. With Vicc, you build your club from the ground up by scouting, trading and winning amazing rewards in our fantasy competitions."
            />
          </Section>

          <Section
            icon={<GuideIcon src={Star} alt="" />}
            title={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Title"
                defaultMessage="Build Your Squad"
              />
            }
            subtitle={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Subtitle"
                defaultMessage="The rules for drafting your squad"
              />
            }
          >
            <FlexColContainer>
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Content"
                defaultMessage="To begin, select 8 players from the league of your choice with a 400-point budget."
              />
              <BulletPoints
                bulletPoints={[
                  defineMessage({
                    id: 'Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Content.BulletPoint1',
                    defaultMessage:
                      'A player’s last-15 game score average (L15) determines their budget points value',
                  }),
                  defineMessage({
                    id: 'Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Content.BulletPoint2',
                    defaultMessage:
                      'If the player played less than 3 games in the last 15, his budget value is determined based on his last 40 games, or it is set to 40 if not enough games are played',
                  }),
                  defineMessage({
                    id: 'Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Content.BulletPoint3',
                    defaultMessage:
                      'You can have a maximum of two players from the same club',
                  }),
                  defineMessage({
                    id: 'Draft.BeginnersGuideBanner.BeginnersGuideDialog.Draft.Content.BulletPoint4',
                    defaultMessage:
                      'At the end of each Game Week, you can swap two players within your draft budget',
                  }),
                ]}
              />
            </FlexColContainer>
          </Section>

          <Section
            icon={<GuideIcon src={Ball} alt="" />}
            title={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Compose.Title"
                defaultMessage="Compose Your Team"
              />
            }
            subtitle={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Compose.Subtitle"
                defaultMessage="Submit your best 5-a-side team"
              />
            }
          >
            <FormattedMessage
              id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Compose.Content"
              defaultMessage="Once you’ve selected your initial 8 players, it’s time to compose your 5-player line-up consisting of: 1 Wicketkeeper, 1 Defender, 1 Fielder, 1 Forward and 1 extra player which is any player in an outfield position. Select the letter “C” to assign your team captain. Choose wisely, as your captain’s score will be boosted by 50%."
            />
          </Section>

          <Section
            icon={<GuideIcon src={Trophy} alt="" />}
            title={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Scores.Title"
                defaultMessage="Revolutionary Scoring Matrix"
              />
            }
            subtitle={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Scores.Subtitle"
                defaultMessage="Introducing our advanced scoring system"
              />
            }
          >
            <FormattedMessage
              id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Scores.Content"
              defaultMessage="Scoring is designed to best match each player's contribution to their team's success. From goals and assists to more nuanced actions like tackles, long passes and duels won, Vicc’s sophisticated scoring system tracks 48 different stats. A player’s score ranges from 0 to 100."
            />
          </Section>

          <Section
            icon={<GuideIcon src={Medal} alt="" />}
            title={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Rewards.Title"
                defaultMessage="Win Amazing Rewards"
              />
            }
            subtitle={
              <FormattedMessage
                id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Rewards.Subtitle"
                defaultMessage="Climb the leaderboards and win rewards"
              />
            }
          >
            <FormattedMessage
              id="Draft.BeginnersGuideBanner.BeginnersGuideDialog.Rewards.Content"
              defaultMessage="Each Game Week, your team's performance will help you win incredible digital Card rewards, signed jerseys, match day tickets and more!"
            />
          </Section>
        </DialogContainer>
      }
    />
  );
};

export default BeginnersGuideDialog;
