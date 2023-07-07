import classNames from 'classnames';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Rarity } from '__generated__/globalTypes';
import ScarcityIcon from '@core/atoms/icons/ScarcityIcon';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { Text16, TypographyVariant } from '@core/atoms/typography';
import { Color } from '@core/style/types';

interface Props {
  displayName: string;
  path: string | null;
  description: ReactNode;
  separator?: ReactNode;
  Title?: TypographyVariant;
  titleColor?: Color;
  Details?: TypographyVariant;
  detailsColor?: Color;
  withoutLink?: boolean;
  row?: boolean;
  tokenDetails?: ReactNode;
  scarcity?: Rarity;
}

const Root = styled.div`
  &.row {
    flex-direction: row;
  }
`;
const LinkWrapper = styled(Link)`
  &:hover {
    text-decoration: underline;
    color: var(--c-link);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const TokenDescriptionFromProps = ({
  displayName,
  path,
  description,
  Title = Text16,
  titleColor = 'var(--c-neutral-1000)',
  Details = Title,
  detailsColor = titleColor,
  withoutLink = false,
  tokenDetails,
  row = false,
  scarcity,
}: Props) => {
  return (
    <Root className={classNames({ row })}>
      <Row>
        {scarcity && <ScarcityIcon scarcity={scarcity} size="lg" />}
        <Title color={titleColor}>
          {withoutLink || !path ? (
            displayName
          ) : (
            <LinkWrapper to={path}>{displayName}</LinkWrapper>
          )}
          {tokenDetails}
        </Title>
      </Row>
      <Details color={detailsColor}>{description}</Details>
    </Root>
  );
};

export default TokenDescriptionFromProps;
