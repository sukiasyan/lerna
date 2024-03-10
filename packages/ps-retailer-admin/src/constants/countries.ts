import { iso31661 } from 'iso-3166';

type ICountry = {
  key: string;
  id: number;
};

const COUNTRIES: ICountry[] = iso31661.map((country, index) => ({
  key: country.alpha2,
  id: index + 1
}));

export const COUNTRIES_BY_ID: Record<number, ICountry> = {};
export const COUNTRIES_BY_CODE: Record<string, ICountry> = {};
export const COUNTRY_CODES: string[] = [];

COUNTRIES.forEach((country) => {
  COUNTRIES_BY_ID[country.id] = country;
  COUNTRIES_BY_CODE[country.key] = country;
  COUNTRY_CODES.push(country.key);
});

export const countryIdToCode = (countryId: number | string): string =>
  COUNTRIES_BY_ID[Number(countryId)]?.key;
export const countryCodeToId = (countryCode: string): number =>
  COUNTRIES_BY_CODE[countryCode]?.id;
