import { gql } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { ReactNode } from 'react';
import styled from 'styled-components';

import Block from '@core/atoms/layout/Block';
import { Text16 } from '@core/atoms/typography';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  link: string;
  fullWidth?: boolean;
}

const Root = styled(Block)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 120px;
  padding: 0px 30px;
  width: 100%;
  & + & {
    margin-top: 0;
  }
`;
const Left = styled.div`
  text-align: left;
`;

export const RelatedPage = ({
  title,
  subtitle,
  children,
  link,
  fullWidth,
}: Props) => {
  return (
    <Grid item md={fullWidth ? 12 : 6} xs={12}>
      <Root to={link}>
        {children}
        <Left>
          <Text16 bold>{title}</Text16>
          <Text16 color="var(--c-neutral-600)">{subtitle}</Text16>
        </Left>
      </Root>
    </Grid>
  );
};

RelatedPage.fragments = {
  card: gql`
    fragment RelatedPage_card on Card {
      slug
      assetId
    }
  `,
};

export default RelatedPage;
