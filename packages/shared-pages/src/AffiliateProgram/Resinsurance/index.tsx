import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import DecoratedRow from '@sorare/core/src/components/marketing/DecoratedRow';
import { Romie20 } from '@sorare/core/src/components/marketing/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { resinsurances } from './data';

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    width: 25%;
  }
`;

type Resinsurance = {
  icon: IconDefinition;
  title: ReactNode;
  subtitle: ReactNode;
};

type ResinsuranceItemProps = {
  resinsurance: Resinsurance;
};
const ResinsuranceItem = ({
  resinsurance: { icon, title, subtitle },
}: ResinsuranceItemProps) => (
  <Item>
    <Title2>
      <FontAwesomeIcon icon={icon} size="lg" color="var(--c-pink-600)" />
    </Title2>
    <Romie20 color="var(--c-neutral-100)">{title}</Romie20>
    <Text16 color="var(--c-neutral-600)">{subtitle}</Text16>
  </Item>
);

export const Resinsurance = () => {
  return (
    <DecoratedRow
      title={
        <FormattedMessage
          id="AffiliateProgram.reinsurance.why.title"
          defaultMessage="The affiliate program"
        />
      }
      decorationText={
        <FormattedMessage
          id="AffiliateProgram.reinsurance.why"
          defaultMessage="Why ?"
        />
      }
      items={resinsurances.map((resinsurance, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <ResinsuranceItem key={key} resinsurance={resinsurance} />
      ))}
    />
  );
};

export default Resinsurance;
