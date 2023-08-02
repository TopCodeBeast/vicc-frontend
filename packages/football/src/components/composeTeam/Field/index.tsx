import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { keyframes } from 'styled-components';

import { Caption, Title2 } from '@sorare/core/src/atoms/typography';
import { GAME_RULES } from '@sorare/core/src/constants/routes';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Card, { Props as CardProps } from './Card';
import CardPlaceholder, {
  Props as CardPlaceholderProps,
} from './CardPlaceholder';
import ConfirmButton, { Props as ConfirmButtonProps } from './ConfirmButton';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }`;

const slideIn = keyframes`
  from {
    transform: translateY(calc(var(--y, 0%) + 10%));
    opacity: 0;
  }
  to {
    transform: translateY(calc(var(--y, 0%) - 0%));
    opacity: 1;
  }
`;

const Root = styled.section`
  position: relative;
  display: grid;
  grid-template-rows: 1fr min-content 1fr;
  height: 100%;
`;
const Cards = styled.div`
  isolation: isolate;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100%;
  align-self: center;

  /*
   * Place players according to the following terrain
   * 4_Fw  5_Extra
   *   ::before
   * 2_Df  3_Md
   *    1_Gk
   */

  /** Line break */
  &::before {
    content: '';
    width: 100%;
    order: 1;
  }
  > * {
    opacity: 0;
    /* HACK animation-fill-mode forwards breaks CSS variables on Webkit browsers
       We need to split the animation into two parts
     */
    animation: ${slideIn} 0.3s ease-in-out none var(--delay),
      ${fadeIn} 0.3s ease-in-out forwards var(--delay);

    &:nth-child(1) {
      order: 3;
      --y: 25%;
      transform: translateY(var(--y));
    }

    &:nth-child(2) {
      order: 2;
      animation-delay: calc(0.1s + var(--delay)), calc(0.1s + var(--delay));
    }
    &:nth-child(3) {
      order: 4;
      animation-delay: calc(0.15s + var(--delay)), calc(0.15s + var(--delay));
    }

    &:nth-child(4) {
      animation-delay: calc(0.2s + var(--delay)), calc(0.2s + var(--delay));
    }
    &:nth-child(5) {
      animation-delay: calc(0.25s + var(--delay)), calc(0.25s + var(--delay));
    }
  }
  @media (max-height: 650px) {
    flex-wrap: nowrap;
    overflow: auto;
    justify-content: start;
    padding: var(--double-unit) 0;

    &::before,
    &::after {
      content: '';
      order: unset;
      width: unset;
      margin: auto;
    }

    > *:nth-child(n) {
      --y: 0;
      order: unset;
    }
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-self: end;
  gap: var(--unit);
  padding: var(--unit);
  opacity: 0;
  animation: ${slideIn} 0.3s ease-in-out forwards calc(var(--delay) + 0.3s);
  text-align: center;
  align-items: center;
  color: var(--c-static-neutral-100);
  @media ${laptopAndAbove} {
    align-items: flex-end;
    padding: 0 var(--double-unit) var(--double-unit);
  }
`;
const CtaWrapper = styled.div`
  width: 100%;
  @media ${laptopAndAbove} {
    width: min-content;
    justify-self: end;
  }
`;
const Title = styled(Title2)`
  text-align: center;
  width: 100%;
  color: var(--c-static-neutral-100);
  align-self: center;
  opacity: 0;
  padding: var(--unit) 0;
  animation: ${slideIn} 0.3s ease-in-out forwards calc(var(--delay) + 0.3s);
`;

export type Props = {
  render: (props: {
    Card: CardProps;
    CardPlaceholder: CardPlaceholderProps;
  }) => ReactNode;
  confirm: (props: {
    CtaWrapper: React.FC<React.PropsWithChildren<unknown>>;
    ConfirmButton: ConfirmButtonProps;
  }) => ReactNode;
  showTerms?: boolean;
  title: ReactNode;
};

const Field = ({ render, confirm, showTerms = false, title }: Props) => {
  return (
    <Root>
      <Title>{title}</Title>
      <Cards>
        {render({
          Card,
          CardPlaceholder,
        })}
      </Cards>
      <Footer>
        {confirm({ CtaWrapper, ConfirmButton })}
        {showTerms && (
          <Caption>
            <FormattedMessage
              id="ComposeTeams.TermsAndConditions"
              defaultMessage="By confirming your team, you agree to the Sorare: <link>Games Rules</link>"
              values={{
                link: (c: any) => (
                  <a
                    href={GAME_RULES}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c}
                  </a>
                ),
              }}
            />
          </Caption>
        )}
      </Footer>
    </Root>
  );
};

export default Field;
