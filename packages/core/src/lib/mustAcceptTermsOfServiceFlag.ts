import { isAfter, parseISO } from 'date-fns';

export const mustAcceptTermsOfServiceFlag = (
  lastTermsOfServiceUpdatedAt: string
) =>
  lastTermsOfServiceUpdatedAt &&
  isAfter(Date.now(), parseISO(lastTermsOfServiceUpdatedAt));
