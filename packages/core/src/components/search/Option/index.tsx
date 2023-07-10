import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Checkbox from '@core/atoms/inputs/Checkbox';
import SimpleRadio from '@core/atoms/inputs/SimpleRadio';
import { LinkBox, LinkOther, LinkOverlay } from '@core/atoms/navigation/Box';
import { Caption, Text14 } from '@core/atoms/typography';
import { laptopAndAbove } from '@core/style/mediaQuery';

type Props = {
  label: string;
  count?: number;
  onClick: () => void;
  active?: boolean;
  before?: ReactNode;
  beforeAll?: ReactNode;
  after?: ReactNode;
  variant: 'checkbox' | 'radio';
  disabled?: boolean;
};

const Root = styled(LinkBox)`
  width: 100%;
  height: calc(5 * var(--unit));
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media ${laptopAndAbove} {
    height: var(--quadruple-unit);
  }
`;
const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: var(--double-unit);
  align-items: center;
`;
const LabelContainer = styled(Text14)`
  display: flex;
  align-items: center;
  gap: var(--unit);
  overflow: hidden;
  width: 100%;
`;
const After = styled(LinkOther)`
  margin-left: auto;
`;
const Label = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const Infos = styled(LinkOverlay)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--intermediate-unit);
  color: var(--c-neutral-400);
  cursor: pointer;
  min-width: 55px; /** ~3 digits */
`;
const Count = styled(Caption)`
  color: var(--c-neutral-600);
  display: inline-block;
`;

export const Option = ({
  label,
  count,
  onClick,
  active,
  before,
  beforeAll,
  after,
  variant,
  disabled,
}: Props) => {
  const { formatNumber } = useIntl();

  return (
    <Root>
      {beforeAll && <LinkOther as="div">{beforeAll}</LinkOther>}
      <Content>
        <LabelContainer>
          {before && <LinkOther as="span">{before}</LinkOther>}
          <Label title={label}>{label}</Label>
          {after && <After as="span">{after}</After>}
        </LabelContainer>
        <Infos as="label">
          {count !== undefined && <Count>{formatNumber(count)}</Count>}
          {variant === 'checkbox' ? (
            <Checkbox
              color="primary"
              checked={!!active}
              currentColor={!active}
              noPadding
              disableRipple
              onClick={onClick}
              disabled={disabled}
            />
          ) : (
            <SimpleRadio
              checkedColor="var(--c-brand-600)"
              checked={!!active}
              name={label}
              onChange={onClick}
              disabled={disabled}
            />
          )}
        </Infos>
      </Content>
    </Root>
  );
};

export default Option;
