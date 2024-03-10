import { CurrencyCode, DEFAULT_LOCALE } from '~/constants';

export const getCurrencyName = (currencyCode: CurrencyCode): string => {
  try {
    return (
      new Intl.DisplayNames(DEFAULT_LOCALE, { type: 'currency' }).of(
        currencyCode
      ) || currencyCode
    );
  } catch {
    return currencyCode;
  }
};
