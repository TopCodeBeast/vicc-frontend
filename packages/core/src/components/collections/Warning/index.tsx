import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Text16 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import { laptopAndAbove } from '@core/style/mediaQuery';

const Root = styled.button`
  display: flex;
  gap: var(--unit);
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 16px;
  padding: var(--double-unit);
  background: rgba(var(--c-rgb-yellow-600), 0.2);
  text-align: left;
  width: 100%;
  b {
    color: var(--c-yellow-800);
  }
  @media ${laptopAndAbove} {
    flex-wrap: nowrap;
  }
`;
const Info = styled.div`
  display: flex;
  gap: var(--unit);
`;
const ButtonWrapper = styled(LoadingButton)`
  width: 100%;
  @media ${laptopAndAbove} {
    width: auto;
  }
`;

type Props = {
  onClick?: () => Promise<void>;
  loading?: boolean;
};
const Warning = ({ onClick, loading }: Props) => {
  return (
    <Root as={onClick ? 'button' : 'div'} type="button" onClick={onClick}>
      <Info>
        <Text16 color="var(--c-yellow-600)">
          <FontAwesomeIcon icon={faInfoCircle} />
        </Text16>
        <Text16>
          <FormattedMessage
            id="collections.Warning.message"
            defaultMessage="If a card is <b>listed in the market</b> the points does not count in the collection score"
            values={{ b: Bold }}
          />
        </Text16>
      </Info>
      {onClick && (
        <ButtonWrapper component="span" color="black" small loading={!!loading}>
          <FormattedMessage
            id="collections.Warning.cta"
            defaultMessage="Unlist"
          />
        </ButtonWrapper>
      )}
    </Root>
  );
};

export default Warning;
