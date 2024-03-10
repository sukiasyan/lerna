import DataObjectIcon from '@mui/icons-material/DataObject';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import {
  GridActionsCellItem,
  GridRenderCellParams
} from '@mui/x-data-grid-pro';
import { useTranslation } from 'react-i18next';

import StatusIndicator from '../StatusIndicator';

import { IUnityLocalStoreOverview, IUnityStatus } from '~/types/Retailers';

export const LocalStoreColumns = (
  onEdit: (id: string) => void,
  onDelete: (params: GridRenderCellParams) => void,
  onRestore: (params: GridRenderCellParams) => void,
  handleDataSourcesClick: (dataSourceRow: IUnityLocalStoreOverview) => void
) => {
  const { t } = useTranslation();

  return [
    {
      field: 'name',
      headerName: t('backoffice.common.name'),
      minWidth: 200,
      maxWidth: 350
    },
    {
      field: 'status',
      headerName: t('backoffice.common.status'),
      width: 200,
      renderCell: ({ value }: GridRenderCellParams) => (
        <StatusIndicator value={value} />
      )
    },
    {
      field: 'storeType',
      headerName: t('backoffice.retailers.importer.create.storeType'),
      minWidth: 200,
      maxWidth: 350,
      renderCell: ({ value }: GridRenderCellParams) => value?.replace('_', ' ')
    },
    {
      field: 'PSRLSID',
      headerName: t('backoffice.common.psrlsId'),
      renderCell: ({ value }: GridRenderCellParams) => `# ${value}`,
      flex: 1
    },
    {
      field: 'storeExternalID',
      headerName: t('backoffice.common.externalID'),
      flex: 1
    },
    {
      field: 'alternatePSCodes,',
      headerName: t('backoffice.common.alternateCodes'),
      renderCell: ({ row }: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <div>
            {row?.alternatePSCodes
              ?.map(
                (item: { sourceSystem: string; sourceEntityID: string }) =>
                  `${item.sourceSystem}: ${item.sourceEntityID}`
              )
              .join(', ')}
          </div>
        </Stack>
      ),
      flex: 1
    },
    {
      field: 'geoCode.latitude',
      headerName: t('backoffice.common.latitude'),
      valueGetter: ({ row }: GridRenderCellParams) =>
        row.geoCode?.latitude ?? '',
      maxWidth: 200
    },
    {
      field: 'geoCode.longitude',
      headerName: t('backoffice.common.longitude'),
      valueGetter: ({ row }: GridRenderCellParams) =>
        row.geoCode?.longitude ?? '',
      maxWidth: 200
    },
    {
      field: 'address.name',
      headerName: t('backoffice.common.addressName'),
      valueGetter: ({ row }: GridRenderCellParams) => row.address.name,
      flex: 1
    },
    {
      field: 'address.address.street1',
      headerName: t('backoffice.common.street1'),
      valueGetter: ({ row }: GridRenderCellParams) => row?.address?.street1,
      flex: 1
    },
    {
      field: 'address.address.street2',
      headerName: t('backoffice.common.street2'),
      valueGetter: ({ row }: GridRenderCellParams) => row?.address?.street2,
      flex: 1
    },
    {
      field: 'address.city',
      headerName: t('backoffice.common.city'),
      valueGetter: ({ row }: GridRenderCellParams) => row?.address?.city,
      minWidth: 200,
      maxWidth: 350
    },
    {
      field: 'address.stateOrProvidence',
      headerName: t('backoffice.common.state'),
      valueGetter: ({ row }: GridRenderCellParams) =>
        row?.address?.stateOrProvidence,
      maxWidth: 200
    },
    {
      field: 'address.postalCode',
      headerName: t('backoffice.common.postcode'),
      valueGetter: ({ row }: GridRenderCellParams) => row?.address?.postalCode,
      maxWidth: 200
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('backoffice.common.actions'),

      maxWidth: 100,
      cellClassName: 'actions',
      getActions: (params: GridRenderCellParams) => {
        const isNeitherActiveNorInactive = !(
          params.row.status === IUnityStatus.ACTIVE ||
          params.row.status === IUnityStatus.INACTIVE
        );

        return [
          <IconButton
            onClick={() => handleDataSourcesClick(params.row)}
            color="primary"
          >
            <DataObjectIcon
              fontSize="small"
              color="action"
              sx={{ height: 16 }}
            />
          </IconButton>,
          <GridActionsCellItem
            disabled={isNeitherActiveNorInactive}
            icon={<EditIcon />}
            label={t('backoffice.common.edit')}
            className="textPrimary"
            onClick={() => onEdit(params.row.PSRLSID)}
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

export default LocalStoreColumns;
