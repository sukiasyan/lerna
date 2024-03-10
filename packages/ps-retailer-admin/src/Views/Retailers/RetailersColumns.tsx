import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { MenuItem, Select, Stack, TextField } from '@mui/material';

import {
  getGridStringOperators,
  GridActionsCellItem,
  GridFilterModel,
  GridRenderCellParams
} from '@mui/x-data-grid-pro';
import { TFunction } from 'i18next';
import { Link, NavigateFunction } from 'react-router-dom';

import StatusIndicator from './StatusIndicator';

import { CountryFlag } from '~/components/CountryFlag/CountryFlag';
import { IUnityStatus } from '~/types/Retailers';
import { getCountryName } from '~/utils/getCountryName.ts';
import { CountryAutocomplete } from '~/components/CountryAutocomplete';
import { COUNTRY_CODES } from '~/constants';
import { Dispatch, SetStateAction } from 'react';

const RetailersColumns = (
  t: TFunction<'translation', undefined>,
  navigate: NavigateFunction,
  onDelete: (params: GridRenderCellParams) => void,
  onRestore: (params: GridRenderCellParams) => void,
  setFilterModel: Dispatch<SetStateAction<GridFilterModel>>
) => {
  const onEdit = (params: GridRenderCellParams) => {
    localStorage.setItem('openRetailerEditDrawer', JSON.stringify(true));
    navigate(
      `/retailerDetails?retailer=${params.row.name}&id=${params.row.PSRTID}`
    );
  };

  const stringOperators = getGridStringOperators().filter(
    (op) => op.value === 'equals' || op.value === 'contains'
  );

  const equalsOperators = getGridStringOperators().filter(
    (op) => op.value === 'equals'
  );

  const handleFilterChange = (field: string, selectedValue: string | null) => {
    setFilterModel((prevFilterModel) => {
      // Find the index of the filter item corresponding to the field
      const filterIndex = prevFilterModel.items.findIndex(
        (item) => item.field === field
      );

      // If selectedValue is null or an empty string, remove the filter item
      if (selectedValue === null || selectedValue === '') {
        // If the filter item exists, remove it from the filterModel
        if (filterIndex !== -1) {
          return {
            items: prevFilterModel.items.filter(
              (_, index) => index !== filterIndex
            )
          };
        }
      } else {
        // If the selected value is not null or empty, update the existing filter item or add a new one
        const newFilterItem = {
          field: field,
          operator: 'equals',
          id: Math.random(),
          value: selectedValue,
          fromInput: ':r4b:'
        };

        if (filterIndex === -1) {
          // If the filter item does not exist, add it to the filterModel
          return {
            items: [...prevFilterModel.items, newFilterItem]
          };
        } else {
          // If the filter item exists, update it with the new value
          return {
            items: prevFilterModel.items.map((item, index) =>
              index === filterIndex ? newFilterItem : item
            )
          };
        }
      }

      // Return the previous filterModel if no changes are made
      return prevFilterModel;
    });
  };

  const handleCountryChange = (selectedCountry: string | null) => {
    handleFilterChange('countryCode', selectedCountry);
  };

  const handleStatusChange = (selectedStatus: string | null) => {
    handleFilterChange('status', selectedStatus);
  };

  return [
    {
      field: 'name',
      headerName: t('backoffice.common.name'),
      minWidth: 200,
      maxWidth: 350,
      filterOperators: stringOperators,
      renderCell: (params: GridRenderCellParams): React.ReactNode => (
        <Link
          to={{
            pathname: '/retailerDetails',
            search: `?id=${params.row.PSRTID}`
          }}
          style={{ color: 'rgba(0, 0, 0, 0.87)', textDecoration: 'none' }}
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'status',
      headerName: t('backoffice.common.status'),
      filterOperators: equalsOperators,
      width: 200,
      renderCell: ({ value }: GridRenderCellParams) => (
        <StatusIndicator value={value} />
      ),
      renderHeaderFilter: () => (
        <Select
          fullWidth
          defaultValue=""
          onChange={(event) => handleStatusChange(event.target.value)}
        >
          <MenuItem value=""> No Filter </MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="Deleted_">Deleted</MenuItem>
          <MenuItem value="Candidate">Incomplete (Candidate)</MenuItem>
        </Select>
      )
    },
    {
      field: 'PSRTID',
      headerName: 'PSRTID',
      filterOperators: equalsOperators,
      flex: 1,
      maxWidth: 350
    },
    {
      field: 'countryCode',
      headerName: t('backoffice.common.country'),
      filterOperators: equalsOperators,
      width: 200,

      renderCell: (params: GridRenderCellParams): React.ReactNode => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CountryFlag countryCode={params.value} />
          <div>{getCountryName(params.value)}</div>
        </Stack>
      ),
      renderHeaderFilter: () => (
        <CountryAutocomplete
          fullWidth
          options={COUNTRY_CODES}
          onChange={(event, value) => {
            event.preventDefault();
            handleCountryChange(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(event) => {
                event.preventDefault();
                handleCountryChange(event.target.value);
              }}
              fullWidth
              name="countries"
            />
          )}
        />
      ),
      flex: 1,
      maxWidth: 300
    },
    // {
    //   field: 'PSOID',
    //   headerName: t('backoffice.common.organization'),
    //   filterOperators: equalsOperators,
    //   flex: 1,
    //   maxWidth: 350
    // },
    {
      field: 'alternatePSCodes',
      headerName: t('backoffice.common.alternateCodes'),
      filterOperators: equalsOperators,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <div>
            {params?.row?.alternatePSCodes
              ?.map(
                (item: { sourceSystem: string; sourceEntityID: string }) =>
                  `${item.sourceSystem}: ${item.sourceEntityID}`
              )
              .join(', ')}
          </div>
        </Stack>
      ),
      flex: 1,
      maxWidth: 350
    },
    {
      field: 'domain',
      headerName: t('backoffice.retailers.importer.create.domain'),
      filterOperators: stringOperators,
      flex: 1,
      maxWidth: 350
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('backoffice.common.actions'),
      maxWidth: 100,
      cellClassName: 'actions',
      getActions: (params: GridRenderCellParams) => {
        const isNeitherActiveNorInactive = !(
          params.row.status !== IUnityStatus.DELETED
        );
        return [
          <GridActionsCellItem
            disabled={isNeitherActiveNorInactive}
            icon={<EditIcon />}
            label={t('backoffice.common.edit')}
            className="textPrimary"
            onClick={() => onEdit(params)}
            color="inherit"
            showInMenu
          />,
          <GridActionsCellItem
            icon={
              isNeitherActiveNorInactive ? (
                <RestartAltIcon />
              ) : (
                <DeleteOutlineIcon />
              )
            }
            label={
              isNeitherActiveNorInactive
                ? t('backoffice.common.restore')
                : t('backoffice.common.delete')
            }
            className="textPrimary"
            onClick={() =>
              isNeitherActiveNorInactive ? onRestore(params) : onDelete(params)
            }
            color="inherit"
            showInMenu
          />
        ];
      }
    }
  ];
};

export default RetailersColumns;
