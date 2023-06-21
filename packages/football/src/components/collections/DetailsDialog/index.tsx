import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import {
  Text14,
  Text16,
  Title2,
  Title3,
} from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import DetailedScoreLine, {
  DetailedScoreKey,
  detailedScores,
} from '@football/components/collections/DetailedScoreLine';
import shield from '@football/components/collections/DetailsDialog/assets/shield.svg';
import ProgressBar, { iconScores } from '@football/components/collections/ProgressBar';
import Warning from '@football/components/collections/Warning';

import { DetailsDialog_cardCollection } from './__generated__/index.graphql';

const Root = styled.div`
  padding: var(--quadruple-unit);
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--double-unit);
  background: var(--c-neutral-300);
`;
const Close = styled(CloseButton)`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
`;
const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const ClubBadgeWrapper = styled.div`
  display: flex;
  gap: var(--unit);
`;

type Props = {
  onClose: () => void;
  open: boolean;
  cardCollection?: DetailsDialog_cardCollection;
};
const DetailsDialog = ({ onClose, open, cardCollection }: Props) => {
  const badgeScore = cardCollection?.rarity
    ? iconScores[cardCollection.rarity]?.value
    : null;

  const {
    flags: { useCollectionClubBadge = false },
  } = useFeatureFlags();

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <Root>
        <header>
          <Title2>
            <FormattedMessage
              id="collections.DetailsDialog.title"
              defaultMessage="The Collection Game"
            />
          </Title2>
          <Close onClose={onClose} />
        </header>
        <div>
          <Title3>
            <FormattedMessage
              id="collections.DetailsDialog.section1.title"
              defaultMessage="The Collection Scoring Matrix"
            />
          </Title3>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage
              id="collections.DetailsDialog.section1.description"
              defaultMessage="Each card has a collection score based on the following"
            />
          </Text16>
        </div>
        <List>
          {Object.keys(detailedScores).map(id => {
            return (
              <DetailedScoreLine
                key={id}
                {...detailedScores[id as DetailedScoreKey]}
              />
            );
          })}
        </List>
        <Warning />
        <div>
          <Title3>
            <FormattedMessage
              id="collections.DetailsDialog.section2.title"
              defaultMessage="The Collection Bonus"
            />
          </Title3>
          <ProgressWrapper>
            <Text16 color="var(--c-neutral-600)">
              <FormattedMessage
                id="collections.DetailsDialog.section2.description"
                defaultMessage="An additional scoring bonus on a player’s in-game score – will apply in competitions where XP applies"
              />
            </Text16>
            <ProgressBar
              disableAnimation
              showLabel
              cardCollection={cardCollection}
            />
            {badgeScore && useCollectionClubBadge && (
              <ClubBadgeWrapper>
                <img src={shield} alt="" />
                <Text14 bold color="var(--c-neutral-500)">
                  <FormattedMessage
                    id="DetailsDialog.clubBadge"
                    defaultMessage="Score {badgeScore} points to get an exclusive club badge!"
                    values={{ badgeScore }}
                  />
                </Text14>
              </ClubBadgeWrapper>
            )}
          </ProgressWrapper>
        </div>
      </Root>
    </Dialog>
  );
};

DetailsDialog.fragments = {
  cardCollection: gql`
    fragment DetailsDialog_cardCollection on CardCollection {
      slug
      rarity
      ...ProgressBar_cardCollection
    }
    ${ProgressBar.fragments.cardCollection}
  `,
};

export default DetailsDialog;
