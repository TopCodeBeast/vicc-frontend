import { faCircleCheck, faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import { useTimeLeft } from '@sorare/core/src/hooks/useTimeLeft';

const flex = css`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const Root = styled(Text14)`
  ${flex}
`;
const Label = styled(Caption)`
  ${flex}
`;

export const Owned = () => (
  <Root bold color="var(--c-neutral-800)">
    <FontAwesomeIcon icon={faCircleCheck} />
    <FormattedMessage id="ClubShop.Item.Owned" defaultMessage="Owned" />
  </Root>
);

export const Equipped = () => (
  <Root bold color="var(--c-green-600)">
    <FontAwesomeIcon icon={faCircleCheck} />
    <FormattedMessage id="ClubShop.Item.Equipped" defaultMessage="Equipped" />
  </Root>
);

type OrderConfirmedProps = {
  color?: 'var(--c-green-600)' | 'var(--c-neutral-1000)';
};
export const OrderConfirmed = ({
  color = 'var(--c-green-600)',
}: OrderConfirmedProps) => (
  <Root bold color={color}>
    <FontAwesomeIcon icon={faCircleCheck} />
    <FormattedMessage
      id="ClubShop.Item.OrderConfirmed"
      defaultMessage="Order confirmed"
    />
  </Root>
);

type ExpirationInProps = { time: Date };
export const Expiration = ({ time }: ExpirationInProps) => {
  const { message } = useTimeLeft(time);
  return (
    <Label color="var(--c-neutral-600)">
      <FontAwesomeIcon icon={faClock} />
      <FormattedMessage
        id="ClubShop.Item.Label.ExpirationTime"
        defaultMessage="Expire in {remaining}"
        values={{ remaining: message }}
      />
    </Label>
  );
};
