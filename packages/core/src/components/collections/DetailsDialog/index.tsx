import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Title3, Title4 } from '@core/atoms/typography';
import DetailedScoreLine, {
  DetailedScoreKey,
  detailedScores,
} from '@core/components/collections/DetailedScoreLine';
import shield from '@core/components/collections/DetailsDialog/assets/shield.svg';
import ProgressBar from '@core/components/collections/ProgressBar';
import Warning from '@core/components/collections/Warning';
import Dialog from '@core/components/dialog';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { getShieldScoreRequirement } from '@core/lib/collections';

import { DetailsDialog_cardCollection } from './__generated__/index.graphql';

const Root = styled.div`
  padding: var(--unit) var(--triple-unit) var(--triple-unit) var(--triple-unit);
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
const CenteredTitle4 = styled(Title4)`
  text-align: center;
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
  hideScoreLines?: DetailedScoreKey[];
};
const DetailsDialog = ({
  onClose,
  open,
  cardCollection,
  hideScoreLines = [],
}: Props) => {
  const shieldScore = 0; //getShieldScoreRequirement( //TODO***************
  //   cardCollection?.slug,
  //   cardCollection?.relatedShield
  // );

  const {
    flags: { useCollectionClubBadge = false },
  } = useFeatureFlags();

  const scoreLineKeys = (
    Object.keys(detailedScores) as DetailedScoreKey[]
  ).filter(key => !hideScoreLines.includes(key));

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onClose}
      title={
        <CenteredTitle4>
          <FormattedMessage
            id="collections.DetailsDialog.title"
            defaultMessage="The Collection Game"
          />
        </CenteredTitle4>
      }
      body={
        <Root>
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
            {scoreLineKeys.map(id => {
              return (
                <>DetailedScoreLine51</>
                // <DetailedScoreLine
                //   key={id}
                //   {...detailedScores[id as DetailedScoreKey]}
                // />
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
              {useCollectionClubBadge && (
                <ClubBadgeWrapper>
                  <img src={shield} alt="" />
                  <Text14 bold color="var(--c-neutral-500)">
                    {shieldScore ? (
                      <FormattedMessage
                        id="DetailsDialog.clubBadge"
                        defaultMessage="Score {shieldScore} points to get an exclusive club badge"
                        values={{ shieldScore }}
                      />
                    ) : (
                      <FormattedMessage
                        id="DetailsDialog.noScoreClubBadge"
                        defaultMessage="You can earn an exclusive club badge by reaching a specific score threshold, which varies based on the album's scarcity. This only applies to the latest season albums and licensed clubs."
                      />
                    )}
                  </Text14>
                </ClubBadgeWrapper>
              )}
            </ProgressWrapper>
          </div>
        </Root>
      }
    />
  );
};

DetailsDialog.fragments = {
  cardCollection: gql`
    fragment DetailsDialog_cardCollection on CardCollection {
      slug
      rarity
      ...ProgressBar_cardCollection
      # relatedShield {
      #   id
      #   ...getShieldScoreRequirement_skinShopItem
      # }
    }
    ${ProgressBar.fragments.cardCollection}
    #{getShieldScoreRequirement.fragments.skinShopItem}
  `,
};

export default DetailsDialog;
