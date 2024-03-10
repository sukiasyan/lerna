import DataObjectIcon from '@mui/icons-material/DataObject';
import { IconButton } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useTranslation } from 'react-i18next';

import { SeverityChip } from '~/components/SeverityChip/SeverityChip';
import { SeverityIcon } from '~/components/SeverityIcon/SeverityIcon';
import { IUnityLocalStoreOverview } from '~/types/Retailers';

const OnlineStoreColumns = (
  handleDataSourcesClick: (dataSourceRow: IUnityLocalStoreOverview) => void
) => {
  //Aliases
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
      flex: 1,
      renderCell: ({ value }: GridRenderCellParams) => (
        <SeverityChip
          icon={
            value.toLowerCase() === 'active' ? (
              <SeverityIcon severity="success" />
            ) : (
              <SeverityIcon severity="inactive" />
            )
          }
          label={value}
          severity={value.toLowerCase() === 'active' ? 'success' : undefined}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'storeType',
      headerName: t('backoffice.retailers.importer.create.storeType'),
      minWidth: 200,
      maxWidth: 350
    },
    // {
    //   field: 'retailerTags',
    //   headerName: t('backoffice.common.tags'),
    //   width: 200,
    //   flex: 1,
    //   // TODO: reverse back
    //   renderCell: ({ value }: GridRenderCellParams) => {
    //     return value[0].tags.map((item: string) => {
    //       return (
    //         <span key={item}>
    //           <Chip label={item} variant="filled" /> &nbsp;
    //         </span>
    //       );
    //     });
    //   }
    // },
    {
      field: 'alternatePSCodes',
      headerName: t('backoffice.common.alternateCodes'),
      width: 300,
      flex: 1,
      renderCell: ({ value }: GridRenderCellParams) => {
        return value
          ?.map((code: { sourceSystem: string }) => code.sourceSystem)
          .join(', ');
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('backoffice.common.actions'),
      flex: 1,
      maxWidth: 100,
      cellClassName: 'actions',
      getActions: (params: GridRenderCellParams) => {
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
          </IconButton>
        ];
      }
    }
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   width: 80,
    //   getActions: ({ id }: { id: string }) => [
    //     <GridActionsCellItem
    //       label={t('backoffice.retailers.overview.manageTags')}
    //       onClick={() => handleEditClick(id)}
    //       showInMenu
    //     />
    //   ]
    // }
  ];
};

export default OnlineStoreColumns;
