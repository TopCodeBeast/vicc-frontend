import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CircularProgress } from '@core/atoms/loader/CircularProgress';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: var(--unit);
`;

const StyledIcon = styled(FontAwesomeIcon)`
  width: 1.5em;
`;

const CircularProgressWrapper = styled.div`
  width: 1.5em;
  margin-right: 0.1em;
  display: flex;
  height: 1.5em;
`;

const Bold = styled.span`
  font-weight: var(--t-bold);
`;

const Opaque = styled.span`
  opacity: 0.6;
`;

type Props = {
  fulfilledSlotsCount: number;
  slotsCount: number;
};

export const CollectionPreviewProgress = ({
  fulfilledSlotsCount,
  slotsCount,
}: Props) => {
  const isComplete = fulfilledSlotsCount === slotsCount;

  return isComplete ? (
    <Wrapper>
      <StyledIcon icon={faCircleCheck} />
      <Bold>
        <FormattedMessage
          id="CollectionPreviewProgress.completed"
          defaultMessage="Completed"
        />
      </Bold>
    </Wrapper>
  ) : (
    <Wrapper>
      <CircularProgressWrapper>
        <CircularProgress
          progress={fulfilledSlotsCount}
          maxProgress={slotsCount}
        />
      </CircularProgressWrapper>
      <TextWrapper>
        <Bold>
          {fulfilledSlotsCount} / {slotsCount}
        </Bold>{' '}
        <Opaque>
          <FormattedMessage
            id="CollectionPreviewProgress.cards"
            defaultMessage="Cards"
          />
        </Opaque>
      </TextWrapper>
    </Wrapper>
  );
};
