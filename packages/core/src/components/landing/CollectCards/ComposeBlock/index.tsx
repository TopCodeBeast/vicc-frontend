import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Waypoint } from 'react-waypoint';
import styled from 'styled-components';

import { useIntlContext } from '@core/contexts/intl';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { SectionText } from '../SectionText';
import Field from './Field';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: 0;
  column-gap: calc(10 * var(--unit));

  @media ${tabletAndAbove} {
    flex-direction: row;
    column-gap: calc(21 * var(--unit));
  }
`;

const FieldWrapper = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media ${tabletAndAbove} {
    min-width: 300px;
    flex: 3 1 0;
    margin-bottom: 0px;
  }
`;

const Illustration = ({ nba = false }: { nba?: boolean }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Waypoint
      onEnter={() => setVisible(true)}
      onLeave={() => setVisible(false)}
    >
      <FieldWrapper>
        <Field visible={visible} nba={nba} />
      </FieldWrapper>
    </Waypoint>
  );
};
export const ComposeBlock = () => (
  <Wrapper>
    <Illustration />
    <SectionText
      heading={
        <FormattedMessage
          id="Landing.CollectCards.ComposeBlock.heading"
          defaultMessage="Play Against Global Fans"
        />
      }
      subHeading={
        <FormattedMessage
          id="Landing.CollectCards.ComposeBlock.subheading"
          defaultMessage="Submit five-player lineups (football & NBA) or seven-player lineups (MLB)
          in a range of free competitions against Vicc Managers around the world. Plus, play against friends in private leagues."
        />
      }
    />
  </Wrapper>
);

export const ComposeBlockNBA = () => {
  const { formatMessage } = useIntlContext();

  return (
    <Wrapper>
      <Illustration nba />
      <SectionText
        heading={formatMessage(
          {
            id: 'LandingNBA.ComposeBlock.heading',
            defaultMessage: 'Build your{br}team',
          },
          {
            br: <br />,
          }
        )}
        subHeading={formatMessage({
          id: 'LandingNBA.ComposeBlock.subheading',
          defaultMessage:
            'Pick five player line-ups from your collection of player Cards to move up the global leaderboards. Earn rare Cards and increase your team’s value.',
        })}
      />
    </Wrapper>
  );
};
