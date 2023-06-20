import { FormControl } from '@material-ui/core';
import classNames from 'classnames';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Text18 } from '@sorare/core/src/atoms/typography';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { hidePhoneDetails } from '@sorare/core/src/lib/privacy';

import Field from '../Field';
import data, { getCountry, getInternationalNumber } from './data';

export const DEFAULT_COUNTRY = 'us';

type Props = {
  name: string;
  label?: string;
};

interface SharedInputProps {
  defaultCountry?: string | null;
  defaultPhone?: string | null;
  noBorder?: boolean;
}

type EnabledInputProps = SharedInputProps & {
  onChange: (values: { isValid: boolean; fullNumber: any }) => void;
  disabled?: never;
  phone?: never;
  hideDetails?: never;
};

type DisabledInputProps = SharedInputProps & {
  onChange?: never;
  defaultCountry?: never;
  defaultPhone?: never;
  disabled: true;
  phone: string;
  hideDetails?: boolean;
};

export type InputProps = EnabledInputProps | DisabledInputProps;

const Inputs = styled.fieldset`
  display: flex;
  padding: 0;
  margin: 0;
  border: 1px solid var(--c-neutral-300);
  border-radius: var(--unit);
  &.noBorder {
    border: none;
  }
`;
const InputContainer = styled.label`
  display: flex;
  border: none;
  padding: var(--unit) var(--unit) var(--unit) 0;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-1000);
  flex-basis: 100%;
  font-size: 16px;
  input {
    border: 0;
    background: transparent;
    height: 100%;
    width: 100%;
    padding: 0;
    font-size: 100%;
    font-family: inherit;
    /* Autofill prefix are only supported by autoprefixer@10.4 */
    /* https://github.com/postcss/autoprefixer/issues/626#issuecomment-953722168 */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      background-clip: text;
    }
    &:autofill,
    &:autofill:hover,
    &:autofill:focus {
      background-clip: text;
    }
    &:disabled {
      color: var(--c-neutral-1000);
    }
  }
`;

const CARRET_SVG = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.5608 4.81077L6.00011 10.3714L0.439453 4.81077L2.56077 2.68945L6.00011 6.12879L9.43945 2.68945L11.5608 4.81077Z' fill='%238B8F96'/%3E%3C/svg%3E"`;

const Select = styled.select`
  display: flex;
  border-radius: var(--unit);
  padding: var(--unit) 0 var(--unit) calc(25px + 10px + var(--double-unit));
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-1000);
  flex-basis: 0;
  width: 100%;
  /* Flag and carret background images are inserted from style prop to avoid unacessary class duplication */
  background-repeat: no-repeat;
  background-position: var(--unit) center, right var(--half-unit) center;
  background-size: 25px, 10px;
  appearance: none;
  cursor: pointer;
  &:disabled {
    color: var(--c-neutral-1000);
    cursor: default;
    background-color: transparent;
    background-position: center, right var(--half-unit) center;
    padding: var(--unit) 0 var(--unit) calc(var(--quadruple-unit));
  }
  border: 2px solid transparent;
  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    background-color: var(--c-neutral-300);
  }
  &.error {
    border-color: var(--c-red-300);
  }
`;

const Form = styled(FormControl)`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  overflow: visible;
`;

const resolveDefaultCountry = (defaultCountry?: string | null) =>
  (defaultCountry && data.find(({ iso2 }) => defaultCountry === iso2)) ||
  data.find(({ iso2 }) =>
    navigator.language?.toLowerCase().split('-').includes(iso2)
  ) ||
  data.find(({ iso2 }) => iso2 === DEFAULT_COUNTRY);

const computeDefaultPhone = (selectValue?: { dialCode: string }) =>
  `+${selectValue?.dialCode} `;

export const Input = ({
  defaultPhone,
  defaultCountry,
  onChange,
  disabled,
  phone: forcePhone,
  noBorder,
  hideDetails,
}: InputProps) => {
  const defaultPhoneCountry = useMemo(
    () => getCountry(defaultPhone || forcePhone),
    [defaultPhone, forcePhone]
  );
  const [selectValue, setSelectValue] = useState(() => {
    return (
      defaultPhoneCountry?.country || resolveDefaultCountry(defaultCountry)
    );
  });
  const [phone, setPhone] = useState(
    () =>
      (defaultPhoneCountry?.country && defaultPhoneCountry?.phone) ||
      computeDefaultPhone(selectValue)
  );

  // this is to be able to handle disabled case where phone is enforced
  useEffect(() => {
    if (forcePhone && defaultPhoneCountry) {
      setPhone(defaultPhoneCountry.phone);
      setSelectValue(defaultPhoneCountry.country);
    }
  }, [forcePhone, defaultPhoneCountry]);

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const fullNumber = getInternationalNumber(value, selectValue?.dialCode);
      const countryValue = getCountry(fullNumber);
      const minimumLength = selectValue?.minimumLength || 0;
      if (countryValue && fullNumber.length >= minimumLength) {
        setPhone(countryValue.phone);
        setSelectValue(countryValue.country);
      } else {
        setPhone(value);
      }
      if (onChange) {
        onChange({
          isValid: fullNumber.length > minimumLength,
          fullNumber,
        });
      }
    },
    [selectValue?.dialCode, selectValue?.minimumLength, onChange]
  );

  const onSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const selected = data.find(({ iso2 }) => iso2 === event.target.value);
      if (selected) {
        setSelectValue(selected);
        setPhone(
          selectValue?.dialCode
            ? phone?.replace(selectValue.dialCode, selected.dialCode)
            : phone
        );
      }
    },
    [selectValue?.dialCode, phone]
  );

  return (
    <Inputs className={classNames({ noBorder })}>
      <Select
        onChange={onSelectChange}
        value={selectValue?.iso2}
        disabled={disabled}
        style={{
          backgroundImage: `url(${FRONTEND_ASSET_HOST}/flags/${selectValue?.iso2}.svg), url(${CARRET_SVG})`,
        }}
      >
        {data.map(({ name: countryName, dialCode, iso2 }) => (
          <option key={iso2} value={iso2}>
            {`${countryName} (+${dialCode})`}
          </option>
        ))}
      </Select>
      <InputContainer>
        <input
          type="tel"
          name="tel"
          autoComplete="tel"
          pattern={!disabled && !hideDetails ? '[0-9+ ]{0,15}' : ''}
          value={disabled && hideDetails ? hidePhoneDetails(phone) : phone}
          onChange={onInputChange}
          disabled={disabled}
        />
      </InputContainer>
    </Inputs>
  );
};

const IntlTelInputForm = ({
  name,
  label,
  ...inputProps
}: Props & InputProps) => {
  return (
    <Field
      name={name}
      render={() => {
        return (
          <Form>
            <Text18 bold>{label}</Text18>
            <Input {...inputProps} />
          </Form>
        );
      }}
    />
  );
};

export default IntlTelInputForm;
