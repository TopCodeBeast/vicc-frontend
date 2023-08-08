import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, To } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Title4 } from '@sorare/core/src/atoms/typography';

import { ExpiresIn } from './ExpiresIn';
import background from './assets/promo-starter-lines.svg';

const Banner = styled.div`
  display: flex;

  border-radius: var(--triple-unit);
  background-color: #2a2a2a;
  background-position: right;
  background-image: url(${background}),
    linear-gradient(330deg, #c4812980 3.5%, #2a2a2a00 45%);
  background-size: cover;
  color: var(--c-neutral-100);

  padding: var(--double-unit) var(--triple-unit);
  gap: var(--quadruple-unit);

  cursor: pointer;
  &:hover {
    button {
      background: rgba(204 143 50 / 20%) !important;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--double-unit);
  flex: 1;
`;

const BannerLink = styled(Banner).attrs({ as: Link })`
  &:hover,
  &:focus {
    color: var(--c-neutral-100);
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  text-align: left;
  padding-right: var(-unit);
  gap: var(--half-unit);
`;

const Title = styled(Title4)`
  font: var(--t-16);
  font-weight: var(--t-bold);
  line-height: 1;
`;
const Subtitle = styled(Text14)`
  font: var(--t-14);
  line-height: 1;
`;

const Cta = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
  gap: var(--unit);

  & button {
    border: 1px solid #cc8f32;
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 var(--half-unit) var(--unit);
`;

type Props = {
  expiresIn?: Date;
  onClick?: () => void;
  toRoute?: To;
  icon?: ReactNode;
  className?: string;
};

export const StarterBundleBanner = ({
  expiresIn,
  onClick,
  toRoute,
  icon,
  className,
}: Props) => {
  const props = toRoute ? { to: toRoute } : { onClick };
  const BannerComponent = toRoute ? BannerLink : Banner;
  return (
    <BannerComponent {...props} className={className}>
      {icon && <Icon>{icon}</Icon>}
      <Content>
        <Text>
          <Title>
            <FormattedMessage
              id="StarterBundle.Banner.title"
              defaultMessage="Starter packs"
            />
          </Title>
          <Subtitle>
            <FormattedMessage
              id="StarterBundle.Banner.subtitle"
              defaultMessage="Get access to new tournaments through these limited-time packs."
            />
          </Subtitle>
        </Text>
        <Cta>
          <Button color="black" small type="button">
            <FormattedMessage
              id="StarterBundle.Banner.cta"
              defaultMessage="Choose pack"
            />
          </Button>
          {expiresIn && <ExpiresIn date={expiresIn} />}
        </Cta>
      </Content>
    </BannerComponent>
  );
};
