import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CardRarity, Sport } from '__generated__/globalTypes';
import { ImageCard } from '@core/components/cards/ImageCard';
import { useIntlContext } from '@core/contexts/intl';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { SectionFullText } from '../SectionFullText';
import PlayerCards from '../../PlayerCards';
import EpicCards from '../../EpicCards';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  padding: calc(7 * var(--unit)) calc(3 * var(--unit));
  row-gap: var(--double-unit);
  column-gap: calc(10 * var(--unit));

  @media ${tabletAndAbove} {
    flex-direction: column;
    column-gap: calc(7 * var(--unit));
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  @media ${tabletAndAbove} {
    min-width: 480px;
    margin-bottom: 0px;
    margin-top: 30px;
    flex: 3 1 0;
  }
`;

const urls = [
  "assets/fields/eth2.png",
  "assets/fields/eth.png",
  "assets/fields/eth2.png"
];

export const WinEpicBlock = () => (
  <Wrapper>
    <SectionFullText
      heading={
        <FormattedMessage
          id="Landing.CollectCards.WinBlock.heading"
          defaultMessage="Win Epic Rewards"
          values={{
            br: <br />,
          }}
        />
      }
      subHeading={
        <FormattedMessage
          id="Landing.CollectCards.WinBlock.subheading"
          defaultMessage="Earn amazing rewards based on your players' real- life performance, including ETH, VIP experiences, match tickets, merch, and more."
        />
      }
    />
    <EpicCards
      cards={urls}
    />
  </Wrapper>
);