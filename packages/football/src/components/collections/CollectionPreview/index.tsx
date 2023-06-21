import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { fantasy, glossary } from '@sorare/core/src/lib/glossary';

import { Bonus } from '@football/components/collections/Bonus';
import { CardsNumber } from '@football/components/collections/CardsNumber';
import CollectionBackground from '@football/components/collections/CollectionBackground';
import { Ranking } from '@football/components/collections/Ranking';
import { ScarcityLabel } from '@football/components/collections/ScarcityLabel';
import { Score } from '@football/components/collections/Score';

import { CollectionPreview_cardCollection } from './__generated__/index.graphql';

const Root = styled(CollectionBackground)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--intermediate-unit);
  border-radius: var(--double-unit);
  height: 100%;
`;

const ScarcityWrapper = styled.div`
  align-self: flex-start;
`;

const StyledCaption = styled(Caption)`
  align-self: flex-start;
`;

const ImgWrapper = styled.div`
  height: 80px;
  margin-bottom: var(--unit);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const StyledText16 = styled(Text16)`
  margin: var(--intermediate-unit) 0;
  text-align: center;
`;

const StatsWrapper = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const StatsLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CollectionPreviewStats = ({
  userCardCollection,
  slotsCount,
}: {
  userCardCollection: CollectionPreview_cardCollection['userCardCollection'];
  slotsCount: number;
}) => {
  const defaults = {
    fulfilledSlotsCount: 0,
    score: 0,
    bonus: 0,
    liveRanking: 0,
  };
  const { fulfilledSlotsCount, score, bonus, liveRanking } =
    userCardCollection || defaults;

  return (
    <StatsWrapper>
      <StatsLine>
        <FormattedMessage {...glossary.cards} />
        <CardsNumber ownedCards={fulfilledSlotsCount} totalCards={slotsCount} />
      </StatsLine>
      <StatsLine>
        <FormattedMessage {...fantasy.rank} />
        <Ranking liveRanking={liveRanking} />
      </StatsLine>
      <StatsLine>
        <FormattedMessage {...fantasy.score} />
        <Score score={score} />
      </StatsLine>
      <StatsLine>
        <FormattedMessage {...fantasy.bonus} />
        <Bonus bonus={bonus} />
      </StatsLine>
    </StatsWrapper>
  );
};

type Props = {
  collection: CollectionPreview_cardCollection;
};

export const CollectionPreview = ({ collection }: Props) => {
  const {
    bannerPictureUrl,
    rarity,
    team,
    season,
    slotsCount,
    userCardCollection,
  } = collection;
  if (!team) return null;

  const { pictureUrl, name } = team;
  return (
    <Root bannerPictureUrl={bannerPictureUrl}>
      <ScarcityWrapper>
        <Caption>
          <ScarcityLabel scarcity={rarity || Rarity.custom_series} />
        </Caption>
      </ScarcityWrapper>
      <StyledCaption color="rgba(var(--c-rgb-neutral-1000), 0.8)" bold>
        {season?.name}
      </StyledCaption>
      {pictureUrl && (
        <ImgWrapper>
          <StyledImg alt="" src={pictureUrl} />
        </ImgWrapper>
      )}
      <StyledText16>{name}</StyledText16>
      <CollectionPreviewStats
        slotsCount={slotsCount}
        userCardCollection={userCardCollection}
      />
    </Root>
  );
};

CollectionPreview.fragments = {
  cardCollection: gql`
    fragment CollectionPreview_cardCollection on CardCollection {
      slug
      bannerPictureUrl
      rarity
      slotsCount
      team {
        ... on TeamInterface {
          slug
          name
          pictureUrl
        }
      }
      season {
        startYear
        name
      }
      userCardCollection(forUserSlug: $user) {
        id
        fulfilledSlotsCount
        score
        bonus
        liveRanking
      }
    }
  `,
};
