import classNames from 'classnames';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { MonetaryAmount, Sport } from '__generated__/globalTypes';
import Container from '@sorare/core/src/atoms/layout/Container';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { AUCTION_MARKET_URL, STARTER_BUNDLES_URL } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { sportsLabelsMessages } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import { TermsDialog } from '../TermsDialog';
import coins from '../assets/coins.png';

const Banner = styled.div`
  color: var(--c-neutral-1000);
  display: flex;
  position: relative;
  padding: var(--unit);
  background: linear-gradient(99.55deg, #2575a2 0%, #008d85 100%);
  font-weight: var(--t-bold);
  &.rounded {
    border-radius: var(--unit);
  }
`;
const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row-reverse;
    justify-content: center;
  }
`;
const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row-reverse;
    gap: var(--unit);
  }
`;
const StyledSpan = styled.span`
  color: var(--c-static-yellow-300);
`;
const StyledLink = styled(Link)`
  text-decoration: underline;
  &,
  &:hover,
  &:focus {
    color: var(--c-static-neutral-100);
  }
`;
const TermsLink = styled.button`
  color: var(--c-static-neutral-100);
  text-decoration: underline;
`;

type Props = {
  discountCredits: MessageDescriptor;
  discountCreditsUpTo: MessageDescriptor;
  endDate: string;
  maxDiscount: MonetaryAmount;
  percentageDiscount: number;
  sport: Sport;
  rounded?: boolean;
};

export const DumbConversionCreditBanner = ({
  discountCredits,
  discountCreditsUpTo,
  endDate,
  maxDiscount,
  percentageDiscount,
  sport,
  rounded,
}: Props) => {
  const { fiatCurrency } = useCurrentUserContext();
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { formatNumber, formatDistanceToNowStrict } = useIntlContext();

  const expiring = formatDistanceToNowStrict(parseISO(endDate));

  const currencyCode = fiatCurrency.code.toLowerCase();
  const maxDiscountInFiat =
    (currencyCode in maxDiscount &&
      maxDiscount?.[currencyCode as keyof MonetaryAmount]) ||
    0;

  return (
    <Banner className={classNames({ rounded })}>
      <Container>
        <Content>
          <TextContent>
            <Text14 color="var(--c-static-neutral-500)">
              <FormattedMessage
                id="ConversionCreditBanner.expireIn"
                defaultMessage="Expire {expiring}"
                values={{ expiring }}
              />{' '}
              <TermsLink type="button" onClick={() => setOpenDialog(true)}>
                (
                <FormattedMessage
                  id="ConversionCreditBanner.termLink"
                  defaultMessage="Terms apply"
                />
                )
              </TermsLink>
            </Text14>
            <Text16 color="var(--c-static-neutral-100)">
              <FormattedMessage
                {...(percentageDiscount === 1
                  ? discountCredits
                  : discountCreditsUpTo)}
                values={{
                  span: (...chunks: string[]) => {
                    return <StyledSpan>{chunks}</StyledSpan>;
                  },
                  link1: (...chunks: string[]) => {
                    return (
                      <StyledLink to={AUCTION_MARKET_URL[sport]}>
                        {chunks}
                      </StyledLink>
                    );
                  },
                  link2: (...chunks: string[]) => {
                    return (
                      <StyledLink to={STARTER_BUNDLES_URL[sport]}>
                        {chunks}
                      </StyledLink>
                    );
                  },
                  percentageDiscount: percentageDiscount * 100,
                  maxDiscount: formatNumber(+maxDiscountInFiat, {
                    style: 'currency',
                    currency: fiatCurrency.code,
                  }),
                  sport: <FormattedMessage {...sportsLabelsMessages[sport]} />,
                }}
              />
            </Text16>
          </TextContent>
          <img src={coins} alt="Coins" width={isTabletOrDesktop ? 24 : 40} />
        </Content>
      </Container>
      {openDialog && <TermsDialog onClose={() => setOpenDialog(false)} />}
    </Banner>
  );
};
