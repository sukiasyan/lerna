import {
  Autocomplete,
  AutocompleteProps,
  ListItemIcon,
  MenuItem,
  Typography
} from '@mui/material';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { HTMLAttributes } from 'react';

import { CountryFlag } from '~/components/CountryFlag/CountryFlag';
import { getCountryName } from '~/utils/getCountryName.ts';

const filterOptions = createFilterOptions<string>({
  stringify: (option) => `${option} ${getCountryName(option)}` // Allows to search by code and the name
});

const renderOption = (props: HTMLAttributes<HTMLLIElement>, option: string) => (
  <MenuItem {...props}>
    <ListItemIcon>
      <CountryFlag countryCode={option} />
    </ListItemIcon>
    <Typography noWrap>{getCountryName(option)}</Typography>
  </MenuItem>
);

export const CountryAutocomplete = <
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: AutocompleteProps<string, Multiple, DisableClearable, FreeSolo>
) => (
  <Autocomplete
    filterOptions={filterOptions}
    getOptionLabel={getCountryName}
    renderOption={renderOption}
    {...props}
  />
);
