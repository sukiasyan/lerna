import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from 'react-i18next';

import { IUnityDataSources } from '~/types/Retailers';

const DataSourcesTable = ({
  dataSources
}: {
  dataSources: IUnityDataSources[];
}) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              {t('backoffice.retailers.importer.create.sourceType')}
            </TableCell>
            <TableCell align="left">
              {t('backoffice.retailers.importer.create.source')}
            </TableCell>
            <TableCell align="left">
              {t('backoffice.retailers.importer.create.method')}
            </TableCell>
            <TableCell align="left">
              {t(
                'backoffice.retailers.importer.retailerTable.currencyCodeHeader'
              )}
            </TableCell>
            <TableCell align="left">
              {t('backoffice.common.languageCode')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSources.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left">{row.sourceType ?? '-'}</TableCell>
              <TableCell align="left">{row.source ?? '-'}</TableCell>
              <TableCell align="left">{row.method ?? '-'}</TableCell>
              <TableCell align="left">{row.currencyCode ?? '-'}</TableCell>
              <TableCell align="left">{row.languageCode ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataSourcesTable;
