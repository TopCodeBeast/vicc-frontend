import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { MonetaryAmount, Sport } from '__generated__/globalTypes';
import { ChevronRightBold } from '@sorare/core/src/atoms/icons/ChevronRightBold';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useConversionCredit } from '@sorare/core/src/hooks/useConversionCredit';
import { theme } from '@sorare/core/src/style/theme';

import { TermsDialog } from '../TermsDialog';
import coins from '../assets/coins.png';

const messages = defineMessages({
  discountCredits: {
    id: 'ConversionCreditTinyBanner.discountCredits',
    defaultMessage: '{maxDiscount} credits',
  },
  discountCreditsUpTo: {
    id: 'ConversionCreditTinyBanner.discountCreditsUpTo',
    defaultMessage: '{percentageDiscount}% credits (up to { maxDiscount })',
  },
});

const Banner = styled.div`
  display: inline-flex;
  position: relative;
  padding: var(--half-unit) var(--unit);
  background: linear-gradient(99.55deg, #2575a2 0%, #008d85 100%);
  border-radius: var(--unit);
`;
const Content = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  gap: var(--half-unit);
  justify-content: space-between;
  width: 100%;
`;
const StyledChevronRightBold = styled(ChevronRightBold)`
  color: var(--c-static-neutral-100);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: none;
  }
`;
const TermsLink = styled.button`
  text-decoration: underline;
  &:not(.forceShowTerms) {
    display: none;
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: inline;
  }
`;
const RemoveButton = styled.button`
  margin-left: var(--unit);
`;

type Props = {
  sport?: Sport;
  wrapTerms?: boolean;
  onRemove?: () => void;
};

export const ConversionCreditTinyBanner = ({
  sport,
  wrapTerms = true,
  onRemove,
}: Props) => {
  const { fiatCurrency } = useCurrentUserContext();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { formatNumber, formatDistanceToNowStrict } = useIntlContext();
  const conversionCredit = useConversionCredit(sport);
  if (!conversionCredit) return null;

  const { endDate, maxDiscount, percentageDiscount } = conversionCredit;
  const expiring = formatDistanceToNowStrict(parseISO(endDate), {
    addSuffix: false,
  });

  const currencyCode = fiatCurrency.code.toLowerCase();
  const maxDiscountInFiat =
    (currencyCode in maxDiscount &&
      maxDiscount?.[currencyCode as keyof MonetaryAmount]) ||
    0;

  return (
    <>
      <Banner>
        <Content>
          <img src={coins} alt="Coins" width={16} />
          <Text16 color="var(--c-static-yellow-300)">
            <FormattedMessage
              {...(percentageDiscount === 1
                ? messages.discountCredits
                : messages.discountCreditsUpTo)}
              values={{
                percentageDiscount: percentageDiscount * 100,
                maxDiscount: formatNumber(+maxDiscountInFiat, {
                  style: 'currency',
                  currency: fiatCurrency.code,
                }),
              }}
            />
          </Text16>
          <Text16 color="var(--c-static-neutral-100)">·</Text16>
          <Text16 color="var(--c-static-neutral-100)">{expiring}</Text16>
          {wrapTerms && (
            <>
              <Text14 color="var(--c-static-neutral-100)">
                <TermsLink type="button" onClick={() => setOpenDialog(true)}>
                  (
                  <FormattedMessage
                    id="ConversionCreditTinyBanner.termsLink"
                    defaultMessage="Terms apply"
                  />
                  )
                </TermsLink>
              </Text14>
              <StyledChevronRightBold onClick={() => setOpenDialog(true)} />
            </>
          )}
          {onRemove && (
            <RemoveButton type="button" onClick={onRemove} aria-label="Remove">
              <FontAwesomeIcon
                icon={faTimes}
                color="var(--c-static-neutral-100)"
              />
            </RemoveButton>
          )}
        </Content>
        {openDialog && <TermsDialog onClose={() => setOpenDialog(false)} />}
      </Banner>
      {!wrapTerms && (
        <Text14 color="var(--c-neutral-600)">
          <TermsLink
            className="forceShowTerms"
            type="button"
            onClick={() => setOpenDialog(true)}
          >
            <FormattedMessage
              id="ConversionCreditTinyBanner.termsLink"
              defaultMessage="Terms apply"
            />
          </TermsLink>
        </Text14>
      )}
    </>
  );
};
