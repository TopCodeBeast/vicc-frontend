import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { animated, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Drawer } from '@core/atoms/layout/Drawer';
import { Header } from '@core/components/carddrop/Layout/Header';
import { StepProps } from '@core/components/carddrop/types';
import { CenterVertically } from '@core/components/cardswap/Layout/CenterVertically';
import { useIsDesktop } from '@core/hooks/device/useIsDesktop';
import { glossary } from '@core/lib/glossary';
import useCompleteAndNextStep from '@core/lib/steps/useCompleteAndNextStep';
import { breakpoints, desktopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

const StatPanel = styled(animated.aside)`
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  position: relative;
  z-index: 1;
  overflow: auto;

  border-top-left-radius: var(--double-unit);
  border-bottom-left-radius: var(--double-unit);
`;

const MobileDrawer = styled(Drawer)`
  height: 100%;
  background: var(--c-neutral-100);
  border-radius: var(--double-unit) var(--double-unit) 0 0;
`;

export const Footer = styled.footer`
  width: 100%;
  display: flex;
  justify-self: stretch;
  align-self: flex-end;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #b2b4bf;
  font: var(--t-14);
  height: var(--footer-height);
  pointer-events: none;
  & > * {
    pointer-events: auto;
  }
`;

export const MobileFooter = styled.footer`
  display: flex;
  justify-content: center;
  padding-bottom: var(--quadruple-unit);
`;

const Main = styled.main`
  height: 100%;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 0px;
  overflow-x: hidden;
  --footer-height: calc(16 * var(--unit));
  @media ${tabletAndAbove} {
    transition: 250ms;
    &.drawerOpened {
      grid-template-columns: auto 340px;
    }
  }
  @media ${desktopAndAbove} {
    &.drawerOpened {
      grid-template-columns: auto 440px;
    }
    --footer-height: calc(18 * var(--unit));
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const CloseDrawer = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
  z-index: 2;
`;

const betweenMobileAndTablet =
  breakpoints.mobile + (breakpoints.tablet - breakpoints.mobile) / 2;

export const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  justify-self: center;

  perspective: 1000px;

  & * {
    transform-style: preserve-3d;
  }

  @media ${tabletAndAbove} {
    margin: 0 var(--quadruple-unit);
  }

  & > * {
    padding: var(--unit);
    align-self: center;
    justify-self: center;
  }

  &.two > * {
    flex-basis: 50%;
  }

  &.three > * {
    @media (min-width: ${betweenMobileAndTablet}px) {
      flex-basis: 33%;
    }
  }
  &.four > * {
    @media ${tabletAndAbove} {
      flex-basis: 25%;
    }
  }
  &.four.five > * {
    @media ${tabletAndAbove} {
      flex-basis: 25%;
    }
    @media ${desktopAndAbove} {
      padding: var(--double-unit);
      flex-basis: 20%;
    }
  }
  &.five > * {
    @media ${tabletAndAbove} {
      flex-basis: 20%;
    }
  }
`;

type Props = {
  cardOptions: string[];
  submit: (optionId: string) => Promise<void>;
  renderCard: (
    cardOption: string,
    {
      isDismissed,
      isSelected,
      onSelect,
      slotIndex,
    }: {
      isDismissed: boolean;
      isSelected: boolean;
      onSelect: () => void;
      slotIndex: number;
    }
  ) => ReactNode;
  drawerContent: (
    cardId: string | null,
    onClose?: () => void
  ) => ReactNode | ReactNode;
} & StepProps;

export const PickDailyDropCard = ({
  cardOptions,
  renderCard,
  submit,
  nextStep,
  drawerContent,
}: Props) => {
  const isDesktop = useIsDesktop();
  const { formatMessage } = useIntl();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const panelTransitions = useTransition(isDrawerOpen, {
    from: { x: '100%' },
    enter: { x: '0%', y: '0%' },
    leave: { x: '100%' },
    reverse: isDrawerOpen,
  });

  const { submitting, complete: completeCardDropTask } = useCompleteAndNextStep(
    submit,
    selectedId,
    nextStep
  );

  return (
    <Wrapper className={classNames({ drawerOpened: isDrawerOpen })}>
      <Content>
        <Main>
          <CenterVertically>
            <Header
              title={formatMessage({
                id: 'CardDrop.PickDailyDropCard.title',
                defaultMessage: 'Select a free Card',
              })}
            />
            <Cards className="two three five">
              {cardOptions.map((id, slotIndex) => {
                return renderCard(id, {
                  isSelected: selectedId === id,
                  isDismissed: selectedId !== null && selectedId !== id,
                  onSelect: () => {
                    setSelectedId(id);
                    setIsDrawerOpen(true);
                  },
                  slotIndex,
                });
              })}
            </Cards>
          </CenterVertically>
        </Main>
        <Footer>
          <LoadingButton
            color="white"
            onClick={completeCardDropTask}
            disabled={selectedId === null}
            loading={submitting}
          >
            <FormattedMessage
              id="CardDrop.PickDailyDropCard.cta"
              defaultMessage="Select Card"
            />
          </LoadingButton>
        </Footer>
      </Content>
      {isDrawerOpen && isDesktop && (
        <CloseDrawer>
          <IconButton
            data-testid="close-stat-drawer"
            onClick={() => setIsDrawerOpen(false)}
            color="white"
            icon={faChevronRight}
            aria-label={formatMessage(glossary.close)}
          />
        </CloseDrawer>
      )}
      {isDesktop ? (
        panelTransitions(
          (styles, isOpen) =>
            isOpen && (
              <StatPanel style={styles}>{drawerContent(selectedId)}</StatPanel>
            )
        )
      ) : (
        <MobileDrawer open={isDrawerOpen} side={isDesktop ? 'right' : 'bottom'}>
          {drawerContent(selectedId, () => setIsDrawerOpen(false))}
          <MobileFooter>
            <LoadingButton
              color="black"
              onClick={completeCardDropTask}
              disabled={selectedId === null}
              loading={submitting}
            >
              <FormattedMessage
                id="CardDrop.PickDailyDropCard.cta"
                defaultMessage="Select Card"
              />
            </LoadingButton>
          </MobileFooter>
        </MobileDrawer>
      )}
    </Wrapper>
  );
};
