import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title2 } from '@sorare/core/src/atoms/typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FirstLineupWrapper = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  color: var(--c-green-800);
  align-items: center;
`;

export const DiscoverScarcitiesTitle = () => {
  return (
    <Wrapper>
      <FirstLineupWrapper>
        <FontAwesomeIcon icon={faCircleCheck} />
        <Text16 bold as="span">
          <FormattedMessage
            id="DiscoverScarcities.firstLineupCompleted"
            defaultMessage="First lineup completed!"
          />
        </Text16>
      </FirstLineupWrapper>
      <Title2 as="h1">
        <FormattedMessage
          id="DiscoverScarcities.title"
          defaultMessage="There are several types of Sorare cards"
        />
      </Title2>
    </Wrapper>
  );
};
