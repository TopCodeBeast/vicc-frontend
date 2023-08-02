/* eslint-disable react/no-unescaped-entities */

import { Section, StyledContainer, Text, Title } from '../ui';

export const Mission = () => (
  <Section center spacing>
    <StyledContainer>
      <Title>Mission and vision</Title>
      <Text spacingAfter>
        Sorare CEO and co-founder Nicolas Julia discusses the company's mission
        and vision:
      </Text>
      <iframe
        width="100%"
        height="600"
        src="https://www.youtube-nocookie.com/embed/LDTLSvqmWi0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </StyledContainer>
  </Section>
);
