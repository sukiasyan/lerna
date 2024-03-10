import {
  Autocomplete,
  AutocompleteProps,
  ListItemIcon,
  Typography
} from '@mui/material';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { HTMLAttributes, ReactNode } from 'react';

import { CurrencyCode } from '~/constants';
import { getCurrencyName } from '~/utils';

const filterOptions = createFilterOptions<CurrencyCode>({
  stringify: (option) => `${option} ${getCurrencyName(option)}` // Allows to search by code and the name
});

const renderOption = (
  props: HTMLAttributes<HTMLLIElement>,
  option: CurrencyCode
): ReactNode => (
  <li {...props}>
    <ListItemIcon>{option}</ListItemIcon>
    <Typography noWrap>{getCurrencyName(option)}</Typography>
  </li>
);

export const CurrencyAutocomplete = <
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: AutocompleteProps<CurrencyCode, Multiple, DisableClearable, FreeSolo>
): React.ReactElement => (
  <Autocomplete
    filterOptions={filterOptions}
    getOptionLabel={(option) => getCurrencyName(option as CurrencyCode)}
    renderOption={renderOption}
    {...props}
  />
);
