import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Card,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import copy from 'copy-to-clipboard';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import StatusIndicator from '../StatusIndicator';

import { useGetOnlineStoreQuery } from '~/Store';
import NoDataCard from '~/Views/Retailers/OnlineStores/NoDataCard.tsx';
import ThirdPartyStoreTable from '~/Views/Retailers/OnlineStores/ThirdPartyStoreTable';
import AllIdsCard from '~/Views/Retailers/RetailerDetails/AllIdsCard.tsx';

interface IOnlineStoreProps {
  retailerId: string | null;
  setOpenOnlineStoreDrawer: Dispatch<SetStateAction<boolean>>;
}

const OnlineStore = ({
  retailerId,
  setOpenOnlineStoreDrawer
}: IOnlineStoreProps) => {
  //Aliases
  const { t } = useTranslation();
  const { data } = useGetOnlineStoreQuery(retailerId ?? '');

  const primaryStore = useMemo(() => {
    return data?.filter((item) => item.siteID === null)[0];
  }, [data]);

  const thirdPartyStores = useMemo(() => {
    return data?.filter((item) => item.siteID !== null);
  }, [data]);

  if (data?.length !== 0 && primaryStore) {
    return (
      <>
        <Grid container spacing={2}>
          {/*Name id*/}
          <Grid item xs={4}>
            <Card sx={{ padding: 2, height: 140, justifyContent: 'center' }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
                <Box gridColumn="span 3">
                  <Typography>
                    <Typography
                      variant="body2"
                      lineHeight={2}
                      color="text.secondary"
                    >
                      {t('backoffice.common.name')}
                    </Typography>
                  </Typography>
                </Box>

                <Box gridColumn="span 9">
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" lineHeight={2} noWrap>
                      {primaryStore?.name} &nbsp;
                    </Typography>
                    <StatusIndicator value={primaryStore?.status} small />
                  </Box>
                </Box>

                <Box gridColumn="span 3">
                  <Typography
                    variant="body2"
                    lineHeight={2}
                    color="text.secondary"
                  >
                    ID
                  </Typography>
                </Box>

                <Box gridColumn="span 9">
                  <Box
                    alignItems="center"
                    justifyContent="start"
                    display="flex"
                  >
                    <Typography variant="body2">
                      {primaryStore?.PSROSID}
                    </Typography>
                    <IconButton
                      onClick={() => copy(primaryStore?.PSROSID)}
                      color="primary"
                    >
                      <ContentCopyIcon
                        fontSize="small"
                        color="action"
                        sx={{ height: 16 }}
                      />
                    </IconButton>
                  </Box>
                </Box>
                <Box gridColumn="span 3">
                  <Typography
                    variant="body2"
                    lineHeight={2}
                    color="text.secondary"
                  >
                    Currencies
                  </Typography>
                </Box>

                <Box gridColumn="span 9">
                  <Typography variant="body2" lineHeight={1.7}>
                    {primaryStore?.currencies === null ||
                    primaryStore?.currencies === undefined
                      ? '-'
                      : [
                          ...(primaryStore?.currencies
                            ?.filter((currency) => currency?.default)
                            ?.map(
                              (currency) => `${currency?.code} (default)`
                            ) || []),
                          ...(primaryStore?.currencies
                            ?.filter((currency) => !currency?.default)
                            ?.map((currency) => currency?.code) || [])
                        ].join(', ')}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/*Source Types */}
          <Grid item xs={4}>
            <Card sx={{ padding: 2, height: 140 }}>
              <Grid container>
                <Grid item xs={3}>
                  <Typography
                    variant="body2"
                    lineHeight={2}
                    color="text.secondary"
                  >
                    {t('backoffice.retailers.importer.create.storeType')}
                  </Typography>
                  <Typography
                    variant="body2"
                    lineHeight={2}
                    color="text.secondary"
                  >
                    {t('backoffice.retailers.importer.create.domain')}
                  </Typography>
                  <Typography
                    variant="body2"
                    lineHeight={2}
                    color="text.secondary"
                  >
                    {t('backoffice.common.languages')}
                  </Typography>
                </Grid>

                <Grid item xs={9}>
                  <Typography variant="body2" lineHeight={2}>
                    {primaryStore?.storeType?.replace('_', ' ') || '-'}
                  </Typography>
                  <Typography variant="body2" lineHeight={2}>
                    {primaryStore?.domain || '-'}
                  </Typography>
                  <Typography variant="body2" lineHeight={2}>
                    {primaryStore?.languageCodes === null ||
                    primaryStore?.languageCodes === undefined
                      ? '-'
                      : primaryStore?.languageCodes?.map(
                          (languageCode, index, array) =>
                            // Check if it's the last element in the array
                            index === array.length - 1
                              ? languageCode
                              : `${languageCode}, `
                        )}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          {/*Alternate PS codes*/}
          <Grid item xs={4}>
            <Card sx={{ padding: 2, height: 140 }}>
              <Grid container>
                <Grid item xs={4}>
                  <Typography
                    variant="body2"
                    lineHeight={2}
                    color="text.secondary"
                  >
                    {t('backoffice.common.alternateCodes')}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  {primaryStore.alternatePSCodes === null ||
                  primaryStore.alternatePSCodes === undefined ? (
                    <Typography variant="body2" lineHeight={2}>
                      -
                    </Typography>
                  ) : (
                    <AllIdsCard storeData={primaryStore} showOnlyAlternates />
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        {primaryStore.dataSources !== null &&
          primaryStore.dataSources?.length > 0 && (
            <>
              <Stack sx={{ pt: 2, pb: 1, pl: 1 }}>
                <Typography variant="overline">
                  {t('backoffice.retailers.importer.create.p1StoreSource')}
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">
                            {t(
                              'backoffice.retailers.importer.create.sourceName'
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {t(
                              'backoffice.retailers.importer.create.sourceType'
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {t('backoffice.retailers.importer.create.method')}
                          </TableCell>
                          <TableCell align="center">
                            {t(
                              'backoffice.retailers.importer.retailerTable.currencyCodeHeader'
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {t('backoffice.common.languageCode')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {primaryStore.dataSources?.map((row, index) => (
                          <TableRow key={`${row.sourceType}${index}}`}>
                            <TableCell align="left">{row.source}</TableCell>
                            <TableCell align="center">
                              {row.sourceType}
                            </TableCell>
                            <TableCell align="center">{row.method}</TableCell>
                            <TableCell align="center">
                              {row.currencyCode}
                            </TableCell>
                            <TableCell align="center">
                              {row.languageCode}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </>
          )}

        {!thirdPartyStores && (
          <>
            <Stack sx={{ pt: 2, pb: 1, pl: 1 }}>
              <Typography variant="overline">
                {t('backoffice.retailers.importer.create.thirdPartyStores')}
              </Typography>
            </Stack>

            <NoDataCard
              primaryStore={primaryStore}
              setOpenOnlineStoreDrawer={setOpenOnlineStoreDrawer}
            />
          </>
        )}

        {thirdPartyStores && thirdPartyStores.length !== 0 && (
          <>
            <Stack sx={{ pt: 2, pb: 1, pl: 1 }}>
              <Typography variant="overline">
                {t('backoffice.retailers.importer.create.thirdPartyStores')}
              </Typography>
            </Stack>
            <ThirdPartyStoreTable storeRows={thirdPartyStores} />
          </>
        )}
      </>
    );
  }
  return (
    <NoDataCard
      primaryStore={primaryStore}
      setOpenOnlineStoreDrawer={setOpenOnlineStoreDrawer}
    />
  );
};

export default OnlineStore;
