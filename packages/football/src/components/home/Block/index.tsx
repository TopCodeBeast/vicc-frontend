import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text14, Title4 } from '@sorare/core/src/atoms/typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--unit);
`;

const TitleBlock = styled.div`
  flex: 1;
`;

const Delayable = styled.div`
  width: fit-content;
  &.loading {
    transform: opacity 2000ms ease-in;
    position: relative;
    & > * {
      opacity: 0;
    }
    &:after {
      opacity: 1;
      position: absolute;
      inset: 0 calc(-2 * var(--unit)) 0 0;
      content: '';
      background: rgba(var(--c-rgb-neutral-200), 0.23);
      border-radius: var(--half-unit);
    }
  }
`;

const Title = styled(Title4)`
  color: var(--c-neutral-1000);
`;

const Subtitle = styled(Text14)`
  color: var(--c-neutral-600);
`;

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  loading?: boolean;
};

export const HomeBlock = ({
  title,
  subtitle,
  action,
  children,
  loading,
}: Props) => {
  return (
    <Wrapper>
      {title && (
        <Header>
          <TitleRow>
            <TitleBlock>
              <Delayable className={classNames({ loading })}>
                <Title>{title}</Title>
              </Delayable>
              {subtitle && (
                <Delayable className={classNames({ loading })}>
                  <Subtitle>{subtitle}</Subtitle>
                </Delayable>
              )}
            </TitleBlock>
            {!loading && action}
          </TitleRow>
        </Header>
      )}
      {children}
    </Wrapper>
  );
};
