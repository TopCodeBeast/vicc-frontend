import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import DecoratedRow from '@sorare/core/src/components/marketing/DecoratedRow';
import { Romie20 } from '@sorare/core/src/components/marketing/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { affiliates } from './data';

const Item = styled.a`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    width: 25%;
  }
`;

const ImageCtn = styled.div`
  border-radius: var(--unit);
  overflow: hidden;
`;

const Image = styled.div<{ image: string }>`
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  aspect-ratio: 1;
  border-radius: var(--unit);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`;

type Affiliate = {
  name: string;
  role: ReactNode;
  pictureUrl: string;
  href: string;
};

type AffiliateItemProps = {
  affiliate: Affiliate;
};

const AffiliateItem = ({
  affiliate: { name, role, pictureUrl, href },
}: AffiliateItemProps) => (
  <Item href={href} target="_blank">
    <ImageCtn>
      <Image image={pictureUrl} />
    </ImageCtn>
    <div>
      <Romie20 color="var(--c-static-neutral-100)">{name}</Romie20>
      <Text16 color="var(--c-static-neutral-600)">{role}</Text16>
    </div>
  </Item>
);

export const Affiliates = () => {
  return (
    <DecoratedRow
      title={
        <FormattedMessage
          id="AffiliateProgram.reinsurance.who.title"
          defaultMessage="Discover some of Vicc's Affiliates"
        />
      }
      decorationText={
        <FormattedMessage
          id="AffiliateProgram.reinsurance.who"
          defaultMessage="Who ?"
        />
      }
      items={affiliates.map(affiliate => (
        <AffiliateItem key={affiliate.name} affiliate={affiliate} />
      ))}
      right
    />
  );
};

export default Affiliates;
