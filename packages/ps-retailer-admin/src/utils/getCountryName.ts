export const getCountryName = (countryCode: string): string => {
  if (countryCode === 'XX') {
    return 'Unknown';
  }

  try {
    return (
      new Intl.DisplayNames('en', { type: 'region' }).of(countryCode) ||
      countryCode
    );
  } catch {
    return countryCode;
  }
};
