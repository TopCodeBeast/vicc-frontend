import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Select from '@sorare/core/src/atoms/inputs/Select';
import { Text14, Title6 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';

import { setDuration } from '../../actions';
import { CardDataType, StateProps } from '../../types';
import { OfferBuilderBuildingPage_publicUserInfoInterface } from '../__generated__/index.graphql';

const Wrapper = styled.div`
  padding: var(--double-unit);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--unit);
`;
const messages = defineMessages({
  duration: {
    id: 'OfferBuilder.BuildingPage.DurationInput.title',
    defaultMessage: 'Offer duration',
  },
  nbDays: {
    id: 'OfferBuilder.BuildingPage.DurationInput.nbDays',
    defaultMessage: '{nbDays, plural, one {# day} other {# days}}',
  },
  answersIn: {
    id: 'OfferBuilder.BuildingPage.DurationInput.answersIn',
    defaultMessage:
      '{nickname} typically answers in <bold>less than {hours, plural, one {# hour} other {# hours}}</bold>.',
  },
});

const Subtitle = styled(Text14)`
  color: var(--c-neutral-600);
`;

const allowedDurations = [1, 2, 3, 4, 5, 6, 7] as const;

type Duration = (typeof allowedDurations)[number];

const defaultDuration: Duration = 7;

type OptionType = { label: string; value: Duration };

const InputDuration = <D extends CardDataType>({
  state,
  dispatch,
  to,
}: StateProps<D> & {
  to: OfferBuilderBuildingPage_publicUserInfoInterface;
}) => {
  const { formatMessage } = useIntl();

  const { duration } = state;

  const options = useMemo<OptionType[]>(
    () =>
      allowedDurations.map(nbDays => ({
        label: formatMessage(messages.nbDays, { nbDays }),
        value: nbDays,
      })),
    [formatMessage]
  );

  const selectedItem = options.find(({ value }) => value === duration);

  const onChange = useCallback(
    (newValue?: OptionType | null) => {
      if (newValue) {
        dispatch(setDuration(newValue.value));
      } else {
        dispatch(setDuration(defaultDuration));
      }
    },
    [dispatch]
  );

  return (
    <Wrapper>
      <Title6>
        <FormattedMessage {...messages.duration} />
        {/* {to.hoursToAnswerTrades && (
          <Subtitle>
            <FormattedMessage
              {...messages.answersIn}
              values={{
                bold: Bold,
                nickname: to.nickname,
                hours: to.hoursToAnswerTrades,
              }}
            />
          </Subtitle>
        )} */}
      </Title6>
      <Select
        options={options}
        value={selectedItem}
        onChange={onChange}
        menuPlacement="top"
        menuLateralAlignment="right"
        menuPortalTarget={document.body}
        icon={faChevronDown}
      />
    </Wrapper>
  );
};

export default InputDuration;
