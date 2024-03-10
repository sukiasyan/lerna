import clsx from 'clsx';

import { CustomFlag } from './CountryFlag.styles';

interface ICountryFlag {
  countryCode: string;
  className?: string;
}

export const CountryFlag = ({ countryCode, className }: ICountryFlag) => {
  if (countryCode === 'XX') {
    return <CustomFlag className={clsx(className)} />;
  }

  return (
    <CustomFlag
      className={clsx(className)}
      style={{
        backgroundImage: `url(https://static.gethatch.com/assets/flags/${
          countryCode === 'AN' ? 'NL' : countryCode
        }.svg)`
      }}
    />
  );
};
