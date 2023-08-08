import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { TimeUntilNext } from '@core/atoms/ticker/TimeUntilNext';
import { Text14, Title4 } from '@core/atoms/typography';

const Banner = styled.div`
  display: flex;
  position: relative;

  border-radius: var(--triple-unit);
  color: var(--c-static-neutral-100);

  padding-left: calc(3 * var(--unit));
  padding-right: calc(1 * var(--unit));

  cursor: pointer;
  &:hover {
    button {
      background: #8094ff !important;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  justify-content: space-between;
  flex: 1;
  margin: var(--double-unit) 0;
`;

export const Icon = styled.img`
  position: absolute;
  right: calc(1 * var(--unit));
  margin: var(--half-unit);
  align-self: center;
  justify-content: center;
  height: 90px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  text-align: left;
  padding-right: calc(10 * var(--unit));
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
  flex-direction: column;
  align-items: center;
  gap: var(--half-unit);

  & button {
    border: 1px solid #8094ff;
  }
`;

const TimeUntilNextStyled = styled(TimeUntilNext)`
  font: var(--t-12);
`;
type Props = {
  title: ReactNode;
  subtitle: ReactNode;
  cta: ReactNode;
  timeLeftMessage: MessageDescriptor;
  isAvailable: boolean;
  nextAvailableDate: Date;
  onClick: () => void;
  icon: ReactNode;
  className?: string;
};

export const GenericBanner = ({
  title,
  subtitle,
  cta,
  timeLeftMessage,
  isAvailable,
  nextAvailableDate,
  onClick,
  icon,
  className,
}: Props) => {
  return (
    <Banner onClick={onClick} className={className}>
      <Content>
        <Text>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Text>
        <Cta>
          {isAvailable ? (
            <Button color="black" small type="button">
              {cta}
            </Button>
          ) : (
            <TimeUntilNextStyled
              timeLeftMessage={timeLeftMessage}
              next={nextAvailableDate}
            />
          )}
        </Cta>
      </Content>
      {icon}
    </Banner>
  );
};
