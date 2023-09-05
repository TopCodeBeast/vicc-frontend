import { FormattedMessage } from 'react-intl';

import { Vicc5LeaderboardRarity } from '@sorare/core/src/__generated__/globalTypes';
import CheckboxGroup from '@sorare/core/src/atoms/inputs/CheckboxGroup';
import FilterInDropdown from '@sorare/core/src/components/FilterInDropdown';
import ScarcityBall, {
  ScarcityType,
  supportedScarcities,
} from '@sorare/core/src/components/card/ScarcityBall';

type Props = {
  values: Vicc5LeaderboardRarity[];
  onChange: React.Dispatch<React.SetStateAction<Vicc5LeaderboardRarity[]>>;
};
const RarityFilter = ({ values, onChange }: Props) => {
  const options = Object.keys(Vicc5LeaderboardRarity).reduce<
    {
      value: Vicc5LeaderboardRarity;
      label: React.JSX.Element;
    }[]
  >((array, rarity) => {
    const lowerCaseRarity = rarity.toLowerCase() as ScarcityType;
    if (supportedScarcities.includes(lowerCaseRarity)) {
      array.push({
        label: <ScarcityBall scarcity={lowerCaseRarity} />,
        value: rarity as Vicc5LeaderboardRarity,
      });
    }
    return array;
  }, []);

  return (
    <FilterInDropdown
      darkTheme
      buttonLabel={
        <FormattedMessage
          id="PrizePool.RarityFilter.Title"
          defaultMessage="Scarcities ({numberRaritiesSelected})"
          values={{ numberRaritiesSelected: values.length }}
        />
      }
    >
      <CheckboxGroup
        options={options}
        selectedValues={values}
        onChange={onChange}
      />
    </FilterInDropdown>
  );
};

export default RarityFilter;
