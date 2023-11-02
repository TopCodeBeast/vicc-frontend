import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import { FC, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Container as CoreContainer } from '@sorare/core/src/atoms/container';
import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { draft as messages } from '@sorare/core/src/lib/glossary';
import {
  desktopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { PickerCard } from '@football/components/draft/PickerCard';
import { Budget } from '@football/pages/Draft/Budget';

import {
  Picker_commonDraftCampaign,
  Picker_commonDraftCampaignAutoPick,
  Picker_draftablePlayer,
} from './__generated__/index.graphql';

const Container = styled(CoreContainer)`
  background: var(--c-neutral-200);
  border-top-left-radius: var(--double-unit);
  border-top-right-radius: var(--double-unit);
  border-top: 2px solid var(--c-neutral-300);
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
  padding: var(--intermediate-unit) 0;
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'infos buttons'
      'cards cards';
  }
  @media ${desktopAndAbove} {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    min-height: 15vh;
  }
`;
const BudgetRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--c-neutral-600);
  @media ${tabletAndAbove} {
    justify-content: left;
    gap: var(--double-unit);
  }
`;

const AvgPerOpenPositionRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  &.hidden {
    visibility: hidden;
  }
`;

const Infos = styled.div`
  grid-area: infos;
  display: flex;
  flex-direction: column;
  @media ${tabletAndAbove} {
    gap: var(--half-unit);
  }
`;

const Cards = styled.div`
  grid-area: cards;
  display: flex;
  align-items: center;
  gap: var(--unit);
  max-width: 100%;
  overflow: auto;
  padding: var(--unit) var(--unit) var(--double-unit) 0; /* gap for the remove button */
  margin: auto;
  min-height: calc(64px + var(--triple-unit));
`;

const SlideInCard: FC<React.PropsWithChildren<{ index: number }>> = ({
  children,
  index,
}) => {
  const animation = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, y: 0, scale: 1 },
    config: config.gentle,
    delay: index * 50,
  });
  return <animated.div style={animation}>{children}</animated.div>;
};

const Buttons = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: flex-end;
  gap: var(--unit);
`;

type Props = {
  onSelect: (selected: number) => void;
  activePosition?: number;
  draft: {
    position: Position;
    drafted?: Picker_draftablePlayer;
  }[];
  draftError: string[];
  clear: () => void;
  budget: number;
  remove: (id: string) => void;
  autoFill: () => void;
  submit: () => void;
  loading: Record<'autofill' | 'submit', boolean>;
  showExitCta?: boolean;
};
export const Picker = ({
  onSelect,
  activePosition,
  draft,
  draftError,
  clear,
  budget,
  remove,
  autoFill,
  loading,
  submit,
  ...props
}: Props) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const { playerFilledCount, total } = draft.reduce(
    (prev, { drafted }) => {
      prev.playerFilledCount += drafted ? 1 : 0;
      prev.total -= drafted?.value || 0;
      return prev;
    },
    { playerFilledCount: 0, total: budget }
  );
  const filled = playerFilledCount === draft.length;
  const validDraft = filled && total >= 0;
  const { up: isTablet } = useScreenSize('tablet');
  useEffect(() => {
    if (
      typeof activePosition === 'undefined' ||
      !cardsRef.current?.children[activePosition]
    ) {
      return;
    }
    cardsRef.current.children[activePosition].scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  }, [activePosition]);

  const nbEmptySlots = draft.length - playerFilledCount;

  return (
    <Container {...props}>
      <Content>
        <Infos>
          <BudgetRow>
            <Text14>
              <FormattedMessage
                id="Draft.Picker.Budget.Label"
                defaultMessage="Remaining points"
              />
            </Text14>
            <Budget remainingPoints={total} budget={budget} />
          </BudgetRow>
          <AvgPerOpenPositionRow className={classnames({ hidden: filled })}>
            <Caption color="var(--c-neutral-600)">
              <FormattedMessage
                id="Draft.Picker.AvgPerOpenPosition"
                defaultMessage="Average per open position ({nbEmptySlots})"
                values={{
                  nbEmptySlots,
                }}
              />
            </Caption>
            <Caption color="var(--c-neutral-600)" bold>
              {nbEmptySlots === 0 ? 0 : Math.floor(total / nbEmptySlots)}
            </Caption>
          </AvgPerOpenPositionRow>
        </Infos>
        <Cards ref={cardsRef}>
          {draft?.map(({ position, drafted }, index) => {
            return (
              <SlideInCard
                // eslint-disable-next-line
                key={index}
                index={index}
              >
                <PickerCard
                  active={index === activePosition}
                  error={drafted && draftError.includes(drafted.id)}
                  onClick={() => onSelect(index)}
                  drafted={drafted}
                  position={position}
                  remove={drafted ? () => remove(drafted.id) : undefined}
                />
              </SlideInCard>
            );
          })}
        </Cards>

        <Buttons>
          <Button
            fullWidth={!isTablet}
            small
            disabled={!draft.find(({ drafted }) => !!drafted)}
            color="white"
            onClick={clear}
            style={{ minWidth: 'max-content' }}
          >
            <FormattedMessage {...messages.clear} />
          </Button>
          {validDraft ? (
            <LoadingButton
              fullWidth={!isTablet}
              small
              color="blue"
              onClick={submit}
              loading={loading.submit}
            >
              <FormattedMessage {...messages.confirm} />
            </LoadingButton>
          ) : (
            <LoadingButton
              fullWidth={!isTablet}
              small
              color="white"
              onClick={autoFill}
              loading={loading.autofill}
              disabled={filled || draftError.length > 0}
            >
              <FormattedMessage {...messages.autofill} />
            </LoadingButton>
          )}
        </Buttons>
      </Content>
    </Container>
  );
};

const pickerPlayerFragment = gql`
  fragment Picker_draftablePlayer on DraftablePlayer {
    id
    value
    avatarUrl
    position
    player {
      slug
      displayName
    }
  }
` as TypedDocumentNode<Picker_draftablePlayer>;

Picker.fragments = {
  commonDraftCampaignAutoPick: gql`
    fragment Picker_commonDraftCampaignAutoPick on CommonDraftCampaign {
      slug
      autoPick(selectedPrintablePlayerIds: $selectedPrintablePlayerIds) {
        id
        ...Picker_draftablePlayer
      }
    }
    ${pickerPlayerFragment}
  ` as TypedDocumentNode<Picker_commonDraftCampaignAutoPick>,
  commonDraftCampaign: gql`
    fragment Picker_commonDraftCampaign on CommonDraftCampaign {
      slug
      budget
    }
  ` as TypedDocumentNode<Picker_commonDraftCampaign>,
  draftablePlayer: pickerPlayerFragment,
};
