import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styled from 'styled-components';

import ButtonBase from '@core/atoms/buttons/ButtonBase';
import Dropdown from '@core/atoms/dropdowns/Dropdown';
import { Text16 } from '@core/atoms/typography';
import { LOCALE_KEY, localeConfig } from '@core/contexts/intl';
import useEvents from '@core/lib/events/useEvents';

import { useSetLocale } from './useSetLocale';

type LocaleOption = {
  label: string;
  value: string;
};

const AVAILABLE_LOCALES: LocaleOption[] = (
  Object.keys(localeConfig) as LOCALE_KEY[]
)
  .sort()
  .map(locale => {
    return {
      label: localeConfig[locale].name,
      value: locale,
    };
  });

const Button = styled(ButtonBase)`
  display: flex;
  gap: var(--unit);
  align-items: center;
  cursor: pointer;
  border: none;
  padding: var(--unit) var(--double-unit);
  border-radius: var(--quadruple-unit);
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  &:focus {
    background: var(--c-neutral-300);
  }
`;

const Label = styled(Text16).attrs({ as: 'label' })`
  display: flex;
  padding: var(--unit) var(--quadruple-unit) var(--unit) var(--double-unit);
  color: var(--c-neutral-600);
  &:hover,
  &:focus,
  &:focus-within,
  &.selected {
    background: var(--c-neutral-300);
    cursor: pointer;
  }
`;

const LanguageSwitcher = () => {
  const track = useEvents();
  const trackChange = (source?: string) => {
    track('Click LanguageSwitcher', {
      source,
    });
  };
  const { locale, setLocale } = useSetLocale();
  const currentLocale =
    AVAILABLE_LOCALES.find(i => i.value === locale) ||
    AVAILABLE_LOCALES.find(i => i.value.split('-')[0] === locale);
  return (
    <Dropdown
      lightTheme
      onOpen={() => trackChange()}
      label={
        <Button>
          <span>{currentLocale?.label}</span>
          <FontAwesomeIcon icon={faAngleDown} />
        </Button>
      }
      onChange={e => {
        if (e.target) {
          const { value: currentValue } = e.target as HTMLInputElement;
          if (currentValue) {
            setLocale(currentValue);
            trackChange(currentValue);
          }
        }
      }}
    >
      <>
        {AVAILABLE_LOCALES.map(lg => (
          <Label
            key={lg.value}
            className={classnames({
              selected: currentLocale?.value === lg.value,
            })}
          >
            {lg.label}
            <input
              type="radio"
              name="language"
              value={lg.value}
              defaultChecked={currentLocale?.value === lg.value}
              className="sr-only"
            />
          </Label>
        ))}
      </>
    </Dropdown>
  );
};

export default LanguageSwitcher;
