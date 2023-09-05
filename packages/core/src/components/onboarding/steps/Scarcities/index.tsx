import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { CardRarity, Sport } from '__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import { FullWidth } from '@core/atoms/container';
import { Text16, Title6 } from '@core/atoms/typography';
import { CardsRow } from '@core/components/onboarding/CardsRow';
import { Header } from '@core/components/onboarding/Header';
import { Scrollable } from '@core/components/onboarding/Scrollable';
import { StepLayout } from '@core/components/onboarding/StepLayout';
import { OnboardingTitle } from '@core/components/onboarding/Title';
import { StepProps } from '@core/components/onboarding/types';
import { editionsByRarity } from '@core/lib/cards';
import { glossary } from '@core/lib/glossary';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: var(--unit);
`;

const MyCardWrapper = styled(CardWrapper)`
  img {
    width: 100%;
  }
`;

const RarityExplanation = styled.span`
  color: var(--c-neutral-600);
  font-size: 14px;
`;

const messages = defineMessages({
  availability: {
    id: 'Scarcities.availability',
    defaultMessage: '{nb, number} each season',
  },
});

type Props = StepProps & {
  sport: Sport;
  cardImageUrl: string;
  CardBack: React.FC<React.PropsWithChildren<{ scarcity: CardRarity }>>;
};

export const Scarcities = ({
  nextStep,
  sport,
  cardImageUrl,
  CardBack,
}: Props) => {
  return (
    <StepLayout>
      <Header>
        <OnboardingTitle>
          <FormattedMessage
            id="Scarcities.collect"
            defaultMessage="Collect Vicc Cards"
          />
        </OnboardingTitle>
        <Text16 bold>
          <FormattedMessage
            id="Scarcities.notAllEqual"
            defaultMessage="Not all Cards are created equal."
          />
        </Text16>
        <Text16 bold>
          <FormattedMessage
            id="Scarcities.compete"
            defaultMessage="Compete, trade and win valuable new Cards."
          />
        </Text16>
      </Header>
      <FullWidth>
        <Scrollable>
          <CardsRow>
            <MyCardWrapper>
              <img src={cardImageUrl} alt="" />
              <Title6>
                <FormattedMessage
                  id="Scarcities.common"
                  defaultMessage="Common"
                />
              </Title6>
              <RarityExplanation>
                <FormattedMessage
                  id="Scarcities.commonAvailable"
                  defaultMessage="Unlimited"
                />
              </RarityExplanation>
            </MyCardWrapper>
            <CardWrapper>
              <CardBack scarcity={CardRarity.limited} />
              <Title6>
                <FormattedMessage
                  id="Scarcities.limited"
                  defaultMessage="Limited"
                />
              </Title6>
              <RarityExplanation>
                <FormattedMessage
                  {...messages.availability}
                  values={{ nb: editionsByRarity[sport].limited }}
                />
              </RarityExplanation>
            </CardWrapper>
            <CardWrapper>
              <CardBack scarcity={CardRarity.rare} />
              <Title6>
                <FormattedMessage id="Scarcities.rare" defaultMessage="Rare" />
              </Title6>
              <RarityExplanation>
                <FormattedMessage
                  {...messages.availability}
                  values={{ nb: editionsByRarity[sport].rare }}
                />
              </RarityExplanation>
            </CardWrapper>
            <CardWrapper>
              <CardBack scarcity={CardRarity.super_rare} />
              <Title6>
                <FormattedMessage
                  id="Scarcities.superRare"
                  defaultMessage="Super Rare"
                />
              </Title6>
              <RarityExplanation>
                <FormattedMessage
                  {...messages.availability}
                  values={{ nb: editionsByRarity[sport].super_rare }}
                />
              </RarityExplanation>
            </CardWrapper>
            <CardWrapper>
              <CardBack scarcity={CardRarity.unique} />
              <Title6>
                <FormattedMessage
                  id="Scarcities.unique"
                  defaultMessage="Unique"
                />
              </Title6>
              <RarityExplanation>
                <FormattedMessage
                  {...messages.availability}
                  values={{ nb: editionsByRarity[sport].unique }}
                />
              </RarityExplanation>
            </CardWrapper>
          </CardsRow>
        </Scrollable>
      </FullWidth>
      <Button color="blue" onClick={nextStep}>
        <FormattedMessage {...glossary.continue} />
      </Button>
    </StepLayout>
  );
};
