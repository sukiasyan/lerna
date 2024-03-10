import curr from 'currency-codes';

export const CURRENCY_CODES_BY_ID: { [key: number]: string } = {};

curr.data.forEach((currency, index) => {
  CURRENCY_CODES_BY_ID[index + 1] = currency.code;
});

type ValueOf<T> = T[keyof T];

export type CurrencyCode = ValueOf<typeof CURRENCY_CODES_BY_ID>;
export type LegacyCurrencyId = keyof typeof CURRENCY_CODES_BY_ID;

export const CURRENCY_IDS_BY_CODE = Object.entries(CURRENCY_CODES_BY_ID).reduce(
  (acc, [id, code]) => {
    acc[code] = Number(id) as LegacyCurrencyId;

    return acc;
  },
  {} as Record<CurrencyCode, LegacyCurrencyId>
);

export const AVAILABLE_CURRENCY_CODES = Object.values(CURRENCY_CODES_BY_ID);
