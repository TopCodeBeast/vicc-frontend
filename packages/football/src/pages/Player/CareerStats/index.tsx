import { gql } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Select from '@sorare/core/src/atoms/inputs/Select';
import BlockHeader from '@sorare/core/src/atoms/layout/BlockHeader';
import { Title6 } from '@sorare/core/src/atoms/typography';
import { format as formatSeason } from '@sorare/core/src/lib/seasons';

import SeasonStats from '@sorare/football/src/pages/Player/SeasonStats';

import { CareerStats_player } from './__generated__/index.graphql';

type Props = {
  player: CareerStats_player;
};

const messages = defineMessages({
  season: { id: 'CareerStats.season', defaultMessage: 'Season {season}' },
  noSeason: {
    id: 'CarrerStats.noSeason',
    defaultMessage: 'No season stats available',
  },
});

interface CareerSeasonSelectorProps {
  startYear: number;
  setStartYear: (value: number) => void;
  player: CareerStats_player;
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CareerSeasonSelector = ({
  startYear,
  setStartYear,
  player,
}: CareerSeasonSelectorProps) => {
  const options = useMemo(
    () =>
      player.careerSeasons.map(s => ({
        label: formatSeason(s),
        value: s.startYear,
      })),
    [player.careerSeasons]
  );

  const selectedOption = useMemo(
    () => options.find(o => o.value === startYear),
    [options, startYear]
  );

  const onChangeCallback = useCallback(
    o => setStartYear(o!.value),
    [setStartYear]
  );

  return (
    <Header>
      <Title6 as="h2">
        <FormattedMessage
          id="CareerStats.title"
          defaultMessage="Season stats"
        />
      </Title6>
      <Select
        value={selectedOption}
        onChange={onChangeCallback}
        options={options}
        menuLateralAlignment="right"
      />
    </Header>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const NoSeason = () => {
  const { formatMessage } = useIntl();

  return (
    <Container>
      <BlockHeader title={formatMessage(messages.noSeason)} />
    </Container>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CareerStats = ({ player }: Props) => {
  const [startYear, setStartYear] = useState(
    () => player.careerSeasons.slice(-1)[0]?.startYear
  );

  if (!startYear) {
    return <NoSeason />;
  }

  return (
    <Root>
      <CareerSeasonSelector
        startYear={startYear}
        setStartYear={setStartYear}
        player={player}
      />
      <SeasonStats seasonStartYear={startYear} playerSlug={player.slug} />
    </Root>
  );
};

CareerStats.fragments = {
  player: gql`
    fragment CareerStats_player on Player {
      slug
      careerSeasons(type: CLUB) {
        startYear
      }
    }
  `,
};

export default CareerStats;
