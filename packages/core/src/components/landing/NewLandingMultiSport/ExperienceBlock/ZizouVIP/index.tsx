import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

import logo from './assets/logo.png';

const messages = defineMessages({
  title: {
    id: 'Landing.experienceBlock.ZizouOverlay.title',
    defaultMessage: 'Zidane VIP Experience',
  },
  textEmphasize: {
    id: 'Landing.experienceBlock.ZizouOverlay.textEmphasize',
    defaultMessage:
      'All-expenses-paid trip to play five-a-side with Zinedine Zidane',
  },
  text: {
    id: 'Landing.experienceBlock.ZizouOverlay.text',
    defaultMessage: "Competition: Sorare Global Cup '22 (top-five winners)",
  },
});

const Wrapper = styled.div`
  display: flex;
  direction: ltr;
  position: absolute;
  align-items: center;
  left: var(--intermediate-unit);
  right: var(--intermediate-unit);
  bottom: var(--intermediate-unit);
  padding: var(--intermediate-unit);
  background-color: var(--c-neutral-900);
  gap: var(--intermediate-unit);
  border-radius: var(--double-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    right: unset;
    left: var(--triple-unit);
    bottom: var(--triple-unit);
    padding: var(--unit) var(--intermediate-unit) var(--intermediate-unit)
      var(--intermediate-unit);
  }
`;

const Image = styled.img`
  aspect-ratio: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-size: 13px;
  line-height: 1.5;
  font-family: 'Druk Wide';
  text-transform: uppercase;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 18px;
  }
`;

const Text = styled.p`
  font-size: 10px;
  line-height: 1.5;

  &.emphasize {
    color: #cd9e01;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font: var(--t-12);
  }
`;

export const ZizouVIP = () => {
  const { formatMessage } = useIntl();
  return (
    <Wrapper>
      <Image src={logo} alt="" width={45} height={45} />
      <Content>
        <Title>{formatMessage(messages.title)}</Title>
        <Text className="emphasize">
          {formatMessage(messages.textEmphasize)}
        </Text>
        <Text>{formatMessage(messages.text)}</Text>
      </Content>
    </Wrapper>
  );
};
