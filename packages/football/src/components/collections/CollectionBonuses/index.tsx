import { TypedDocumentNode, gql } from '@apollo/client';
import { differenceInDays, parseISO } from 'date-fns';
import styled from 'styled-components';

import { Caption } from '@sorare/core/src/atoms/typography';
import Gauge from '@sorare/core/src/atoms/ui/GaugeV2';
import DetailedScoreLine, {
  DetailedScoreKey,
  detailedScores,
} from '@sorare/core/src/components/collections/DetailedScoreLine';

import { CollectionBonuses_cardCollectionCard } from './__generated__/index.graphql';

const Root = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
`;
const DaysLeft = styled(Caption)`
  text-align: right;
  margin-left: auto;
  margin-bottom: var(--half-unit);
`;

type Props = {
  cardCollectionCard: CollectionBonuses_cardCollectionCard;
  displayWarning: boolean;
};

export const CollectionBonuses = ({
  cardCollectionCard,
  displayWarning,
}: Props) => {
  const { scoreBreakdown, heldSince } = cardCollectionCard;
  const { total, __typename, ...scores } = scoreBreakdown;
  const remainingDays = differenceInDays(
    new Date(),
    new Date(parseISO(heldSince))
  );
  return (
    <Root>
      {Object.entries(scores).map(([key, value]) => {
        const showProgression =
          !value && key === 'holding' && remainingDays > 0;
        if (!value && !showProgression) {
          return null;
        }
        return (
          <DetailedScoreLine
            key={key}
            listed={displayWarning}
            {...detailedScores[key as DetailedScoreKey]}
            value={value}
            explanation={
              <>
                {detailedScores[key as DetailedScoreKey].explanation}
                {showProgression && remainingDays > 0 && (
                  <div>
                    <DaysLeft>{Math.ceil(remainingDays)}/90</DaysLeft>
                    <Gauge percentage={`${(remainingDays * 100) / 90}%`} />
                  </div>
                )}
              </>
            }
          />
        );
      })}
    </Root>
  );
};

CollectionBonuses.fragments = {
  cardCollectionCard: gql`
    fragment CollectionBonuses_cardCollectionCard on CardCollectionCard {
      id
      heldSince
      scoreBreakdown {
        firstOwner
        firstSerialNumber
        holding
        owner
        shirtMatchingSerialNumber
        specialEdition
        total
      }
    }
  ` as TypedDocumentNode<CollectionBonuses_cardCollectionCard>,
};
