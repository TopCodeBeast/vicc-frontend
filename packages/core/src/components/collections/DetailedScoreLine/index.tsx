import { faExclamation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CardCollectionCardScoreBreakdown } from '__generated__/globalTypes';
import { Caption, Text14 } from '@core/atoms/typography';
import { Score } from '@core/components/collections/Score';
import holding from '@core/components/collections/assets/holding.png';
import jersey from '@core/components/collections/assets/jersey.png';
import owner from '@core/components/collections/assets/owner.png';
import special from '@core/components/collections/assets/special.png';
import ticket from '@core/components/collections/assets/ticket.png';

const Item = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'img label score'
    'img explanation score';
  padding: var(--unit);
  justify-content: start;
  align-items: center;
  column-gap: var(--double-unit);
  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  grid-area: img;
`;
const ExclamationWrapper = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--triple-unit);
  height: var(--triple-unit);
  background-color: var(--c-yellow-600);
  border-radius: 100%;
  border: 3px solid var(--c-neutral-200);
`;
const Img = styled.img`
  width: 40px;
  aspect-ratio: 1;
`;
const StyledText14 = styled(Text14)`
  grid-area: label;
`;
const StyledCaption = styled(Caption)`
  grid-area: explanation;
`;
const ScoreWrapper = styled.div`
  grid-area: score;
  margin-left: auto;
`;

export type DetailedScoreKey = keyof Omit<
  CardCollectionCardScoreBreakdown,
  '__typename' | 'total'
>;
export const detailedScores: Record<
  DetailedScoreKey,
  { img: string; label: ReactNode; value: number; explanation: ReactNode }
> = {
  owner: {
    img: owner,
    label: (
      <FormattedMessage
        id="collections.DetailsDialog.stages.owner"
        defaultMessage="Owned"
      />
    ),
    explanation: (
      <FormattedMessage
        id="collections.DetailsDialog.explanations.owner"
        defaultMessage="Card is in your collection"
      />
    ),
    value: 10,
  },
  holding: {
    img: holding,
    label: (
      <FormattedMessage
        id="collections.DetailsDialog.stages.holding"
        defaultMessage="90d"
      />
    ),
    explanation: (
      <FormattedMessage
        id="collections.DetailsDialog.explanations.holding"
        defaultMessage="Card was not listed or transferred in the last 90 days"
      />
    ),
    value: 10,
  },
  firstOwner: {
    img: owner,
    label: (
      <FormattedMessage
        id="collections.DetailsDialog.stages.firstOwner"
        defaultMessage="New Card"
      />
    ),
    explanation: (
      <FormattedMessage
        id="collections.DetailsDialog.explanations.firstOwner"
        defaultMessage="Card has had max one owner"
      />
    ),
    value: 20,
  },
  specialEdition: {
    img: special,
    label: (
      <FormattedMessage
        id="collections.DetailsDialog.stages.specialEdition"
        defaultMessage="Special"
      />
    ),
    explanation: (
      <FormattedMessage
        id="collections.DetailsDialog.explanations.specialEdition"
        defaultMessage="Special edition card design"
      />
    ),
    value: 20,
  },
  firstSerialNumber: {
    img: ticket,
    label: (
      <FormattedMessage
        id="collections.DetailsDialog.stages.firstSerialNumber"
        defaultMessage="#1"
      />
    ),
    explanation: (
      <FormattedMessage
        id="collections.DetailsDialog.explanations.firstSerialNumber"
        defaultMessage="#1 Serial number"
      />
    ),
    value: 30,
  },
  shirtMatchingSerialNumber: {
    img: jersey,
    label: (
      <FormattedMessage
        id="collections.DetailsDialog.stages.shirtMatchingSerialNumber"
        defaultMessage="#Jersey"
      />
    ),
    explanation: (
      <FormattedMessage
        id="collections.DetailsDialog.explanations.shirtMatchingSerialNumber"
        defaultMessage="Serial number = Jersey number"
      />
    ),
    value: 30,
  },
};

type Props = {
  img: string;
  label: ReactNode;
  value: number;
  explanation: ReactNode;
  listed?: boolean;
};
const DetailedScoreLine = ({
  img,
  label,
  explanation,
  value,
  listed,
}: Props) => {
  return (
    <Item>
      <ImageWrapper>
        {listed && (
          <ExclamationWrapper>
            <FontAwesomeIcon
              color="var(--c-static-neutral-1000)"
              icon={faExclamation}
              size="sm"
            />
          </ExclamationWrapper>
        )}
        <Img src={img} alt="" />
      </ImageWrapper>
      <StyledText14 bold>
        <span>{label}</span>
      </StyledText14>
      <StyledCaption bold color="var(--c-neutral-700)">
        {explanation}
      </StyledCaption>
      <ScoreWrapper>
        <Score score={value} />
      </ScoreWrapper>
    </Item>
  );
};

export default DetailedScoreLine;
