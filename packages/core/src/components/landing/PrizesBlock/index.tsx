import React, { ReactNode, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import { breakpoints, laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

import diamond from './assets/diamond.svg';

const messages = defineMessages({
  title: {
    id: 'Landing.Prizes.Title',
    defaultMessage: 'Exclusive Access + Epic Prizes',
  },
  subtitle: {
    id: 'Landing.Prizes.Subtitle',
    defaultMessage:
      "Here's a sample of one-of-a-kind rewards recently won by Vicc Managers.",
  },
});

const Wrapper = styled(ContentContainer)``;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  margin-top: calc(var(--unit) * 15);
  padding-bottom: var(--triple-unit);

  border-bottom: 1px solid rgba(255, 255, 255, 0.17);

  @media ${tabletAndAbove} {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--intermediate-unit);
  }

  @media ${laptopAndAbove} {
    padding: 0;
    border: none;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  font-family: 'Druk Wide';
  text-transform: uppercase;
  @media ${tabletAndAbove} {
    font-size: 24px;
  }
  @media ${laptopAndAbove} {
    font-size: 28px;
  }
`;

const SubtitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--quadruple-unit) 0;

  @media ${laptopAndAbove} {
    margin-bottom: var(--quadruple-unit);
    padding: var(--triple-unit) calc(var(--unit) * 5);
  }
`;

const Subtitle = styled(Text18)`
  line-height: 1.2;
  @media (min-width: ${breakpoints.laptop}) {
    font-size: 22px;
  }
`;

const List = styled.ul`
  ${hideScrollbar}

  padding: 0;
  margin: 0;
  display: grid;
  overflow: auto;
  scroll-snap-type: x mandatory;
  grid-template-columns: repeat(4, 1fr);

  @media ${laptopAndAbove} {
    display: flex;
    flex-wrap: nowrap;
  }
`;

type Props = {
  children: ReactNode;
};

type PrizeChildren = { isHovered?: boolean };

export const PrizesBlock = ({ children }: Props) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { formatMessage } = useIntl();
  const [isHovered, setIsHovered] = useState(false);

  const childrenWithHoveredProps = React.Children.map(children, child => {
    // Checking if it's a valid React element before cloning
    if (React.isValidElement<PrizeChildren>(child)) {
      return React.cloneElement(child, { isHovered });
    }
    return child;
  });

  return (
    <Wrapper>
      <div>
        <TitleWrapper>
          <div>
            <img src={diamond} alt="diamond" width={24} />
          </div>
          <Title>{formatMessage(messages.title)}</Title>
        </TitleWrapper>
        <SubtitleWrapper>
          <Subtitle>{formatMessage(messages.subtitle)}</Subtitle>
        </SubtitleWrapper>
      </div>
      <List
        ref={listRef}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {childrenWithHoveredProps}
      </List>
    </Wrapper>
  );
};
