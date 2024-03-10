import { GridFilterItem } from '@mui/x-data-grid-pro';

export enum Tag {
  Retailers = 'Retailers',
  Organizations = 'Organizations',
  LocalStores = 'LocalStores',
  Products = 'Products'
}

export type ApiFilter = {
  columnName: string;
  value: (string | number | boolean | null)[];
  operation: string;
};

export type ApiSorting = {
  columnName: string;
  direction: string;
};

export const createApiFilter = (
  filters?: GridFilterItem[]
): ApiFilter[] | string[] => {
  // Transform the MUI X Pro tables filtering object into the format expected by your API
  console.log('Function: createApiFilter - Line 25 - ', filters);

  const transformedFilters = filters?.map((item) => {
    if (item.field === 'alternatePSCodes') {
      return {
        ...item,
        field: 'alternatePSCodes.sourceEntityID'
      };
    }
    return item;
  });

  return (
    transformedFilters?.map((filter) => ({
      columnName: filter.field,
      operation: filter?.value.length > 11 ? 'equals' : filter.operator,
      value: filter?.value ? [filter?.value] : ['']
    })) ?? ['']
  );
};
