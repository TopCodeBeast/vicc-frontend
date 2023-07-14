import { faGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { MarketplacePromotionalEvent } from '@sorare/core/src/__generated__/globalTypes';
import { RainbowBox } from '@sorare/core/src/atoms/layout/RainbowBox';
import { Text14 } from '@sorare/core/src/atoms/typography';

const StyledLink = styled.a`
  align-self: flex-start;
`;
const Container = styled(RainbowBox)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: 0 var(--unit);
  --inside: linear-gradient(
    84.1deg,
    rgba(248, 211, 218, 0.2) 0%,
    rgba(179, 169, 244, 0.2) 28.32%,
    rgba(251, 233, 251, 0.2) 54.01%,
    rgba(79, 148, 253, 0.2) 100%
  );
`;
const GiftIcon = styled(FontAwesomeIcon).attrs({
  icon: faGift,
  size: 'xs',
})`
  path {
    fill: url(#svg-special-reward-gradient);
  }
`;
const StyledCaption = styled(Text14)`
  display: inline;
  margin-left: var(--half-unit);
  color: var(--c-neutral-800);
`;

export const ItemSpecialRewardBadge = ({
  event,
}: {
  event: MarketplacePromotionalEvent;
}) => (
  <StyledLink href={event.rewardDetailsHref!} target="_blank" rel="noreferrer">
    <Container>
      <GiftIcon />
      <StyledCaption>
        <FormattedMessage
          id="ItemPreview.ItemSpecialRewardBadge.SpecialReward"
          defaultMessage="Special reward"
        />
      </StyledCaption>
    </Container>
  </StyledLink>
);
