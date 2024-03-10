import { Card } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useState } from 'react';

import {
  IUnityLocalStoreOverview,
  IUnityOnlineStoreOverview
} from '~/types/Retailers';
import OnlineStoreColumns from '~/Views/Retailers/OnlineStores/OnlineStoreColumns.tsx';
import StoreDetailsDialog from '~/Views/Retailers/StoreDetailsDialog';

interface IThirdPartyStoreTableProps {
  storeRows: IUnityOnlineStoreOverview[];
}

//TODO All commented parts needed for tags, should be added later

const ThirdPartyStoreTable = ({ storeRows }: IThirdPartyStoreTableProps) => {
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedRow, setSelectedRow] = useState('');
  const [selectedDataSourceRow, setSelectedDataSourceRow] = useState<
    IUnityLocalStoreOverview | undefined
  >();

  const [openDataSourcesDialog, setOpenDataSourcesDialog] = useState(false);

  const handleDataSourcesClick = (dataSourceRow: IUnityLocalStoreOverview) => {
    // setSelectedRow(id);
    setSelectedDataSourceRow(dataSourceRow);
    setOpenDataSourcesDialog(true);
  };

  const handleCloseDataSourcesDialog = () => {
    setOpenDataSourcesDialog(false);
  };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  const storeColumns = OnlineStoreColumns(handleDataSourcesClick);

  // const rowsWithActions = storeRows.map((row) => ({ ...row, handleEditClick }));

  // const tagsObject = useMemo(() => {
  //   const selectedRowTags = rowsWithActions
  //     .filter((row) => row.PSROSID === selectedRow)
  //     .map((item) => item.retailerTags);
  //
  //   if (selectedRowTags.length !== 0) {
  //     return selectedRowTags[0];
  //   }
  //
  //   return [];
  // }, [rowsWithActions, selectedRow]);
  //
  // const selectedRetailerId = useMemo(() => {
  //   return rowsWithActions
  //     .filter((row) => row.PSROSID === selectedRow)
  //     .map((item) => item.PSRTID)[0];
  // }, [rowsWithActions, selectedRow]);
  //
  // const selectedStoreName = useMemo(() => {
  //   return rowsWithActions
  //     .filter((row) => row.PSROSID === selectedRow)
  //     .map((item) => item.name)[0];
  // }, [rowsWithActions, selectedRow]);

  return (
    <>
      <Card>
        <DataGridPro
          rows={storeRows}
          columns={storeColumns}
          getRowId={(row) => row.PSROSID}
        />
      </Card>
      <StoreDetailsDialog
        openDataSourcesDialog={openDataSourcesDialog}
        handleCloseDialog={handleCloseDataSourcesDialog}
        selectedDataSourceRow={selectedDataSourceRow}
        storeType="online"
      />
      {/*<TagEditDialog*/}
      {/*  openTagEditDialog={openDialog}*/}
      {/*  handleCloseDialog={handleCloseDialog}*/}
      {/*  selectedRowTags={tagsObject}*/}
      {/*  selectedStoreId={selectedRow}*/}
      {/*  selectedRetailerId={selectedRetailerId}*/}
      {/*  selectedStoreName={selectedStoreName}*/}
      {/*  setShouldRefresh={setShouldRefresh}*/}
      {/*/>*/}
    </>
  );
};

export default ThirdPartyStoreTable;
