import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { DrukWide104, MarketingText20, MarketingText32 } from '../typography';

const Title = styled.div<{ border?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ border }) =>
    border
      ? `
    padding-top: var(--unit);
    border-top: 1px solid var(--c-neutral-1000);`
      : ''}
`;

const TitleTag = styled(Text16)`
  text-transform: uppercase;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(5 * var(--unit));
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-and-a-half-unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: calc(5 * var(--unit));
  }
`;

const Chapo = styled.div`
  grid-area: 1 / 1 / 2 / 2;
`;

const Paragraph = styled.div`
  grid-area: 1 / 2 / 2 / 3;
`;

const Extract = styled(Paragraph)`
  grid-area: 1 / 1 / 2 / 2;
`;

const BottomRightPosition = styled.span`
  @media ${tabletAndAbove} {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

type SharedProps = {
  title?: ReactNode;
  topBorder?: boolean;
  titleTag?: ReactNode;
  paragraph?: ReactNode;
};

type SectionPropsWithExtract = SharedProps & {
  extract?: ReactNode;
  button?: ReactNode;
  chapo?: never;
  paragraph?: never;
};

type SectionPropsWithChapo = SharedProps & {
  chapo?: ReactNode;
  paragraph?: ReactNode;
  extract?: never;
  button?: never;
};

type Props = SectionPropsWithExtract | SectionPropsWithChapo;

export const Section = ({
  title,
  topBorder = false,
  titleTag,
  chapo,
  paragraph,
  button,
  extract,
}: Props) => {
  return (
    <SectionWrapper>
      {title && (
        <Title border={topBorder}>
          <DrukWide104>{title}</DrukWide104>
          {titleTag && <TitleTag> {titleTag}</TitleTag>}
        </Title>
      )}
      {(chapo || paragraph) && (
        <SectionContent>
          {chapo && (
            <Chapo>
              <MarketingText32>{chapo}</MarketingText32>
            </Chapo>
          )}
          {paragraph && (
            <Paragraph>
              <MarketingText20>{paragraph}</MarketingText20>
            </Paragraph>
          )}
        </SectionContent>
      )}
      {(extract || button) && (
        <SectionContent>
          <Extract>
            <MarketingText20>{extract}</MarketingText20>
          </Extract>
          <Paragraph>
            <BottomRightPosition>{button}</BottomRightPosition>
          </Paragraph>
        </SectionContent>
      )}
    </SectionWrapper>
  );
};

export default Section;
