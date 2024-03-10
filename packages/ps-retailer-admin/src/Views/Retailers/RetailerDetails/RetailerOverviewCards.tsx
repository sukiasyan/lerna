import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { CountryFlag } from '~/components/CountryFlag/CountryFlag';
import { useGetRetailerOverviewQuery } from '~/Store';
import AllIdsCard from '~/Views/Retailers/RetailerDetails/AllIdsCard.tsx';
import SocialMedias from '~/Views/Retailers/SocialMedias.tsx';

// TODO remove if details are removed
// function createData(name: string, values: string) {
//   return { name, values };
// }

const RetailerOverviewCards = () => {
  //Aliases
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const PSRTID = queryParams.get('id');
  const { data: getRetailerOverviewApi } = useGetRetailerOverviewQuery({
    PSRTID: PSRTID ?? ''
  });

  // TODO remove if details are removed
  // const retailerAttributesArray = useMemo(() => {
  //   const bopisValue =
  //     getRetailerOverviewApi?.retailer?.retailerAttributes?.bopis === 'true'
  //       ? 'Yes'
  //       : 'No';
  //
  //   const addToCardValue =
  //     getRetailerOverviewApi?.retailer?.retailerAttributes?.addToCart === 'true'
  //       ? 'Yes'
  //       : 'No';
  //   return [
  //     createData('BOPIS', bopisValue),
  //     createData('Direct to Cart', addToCardValue)
  //   ];
  // }, [
  //   getRetailerOverviewApi?.retailer?.retailerAttributes?.bopis,
  //   getRetailerOverviewApi?.retailer?.retailerAttributes?.addToCart
  // ]);

  const languagesLenght =
    getRetailerOverviewApi?.retailer?.languageCodes?.length ?? 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Card sx={{ height: 'auto' }}>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ flex: 1, pb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('backoffice.common.country')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">
                  {getRetailerOverviewApi?.retailer?.countryCode}
                </Typography>
                <CountryFlag
                  countryCode={
                    getRetailerOverviewApi?.retailer?.countryCode || 'XX'
                  }
                />
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('backoffice.common.languages')}
              </Typography>
              <Typography variant="body2">
                {getRetailerOverviewApi?.retailer?.languageCodes === null ||
                getRetailerOverviewApi?.retailer?.languageCodes === undefined
                  ? '-'
                  : getRetailerOverviewApi?.retailer?.languageCodes?.map(
                      (languageCode, index) => (
                        <span key={languageCode}>
                          {languageCode}
                          {index !== languagesLenght - 1 ? ',' : ''}{' '}
                        </span>
                      )
                    )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ flex: 1, pt: 2, pb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {t('backoffice.common.organization')}
              </Typography>
              <Typography variant="body2">
                {getRetailerOverviewApi?.organization?.name ?? '-'}
              </Typography>
            </Stack>

            <Divider />
            {getRetailerOverviewApi && (
              <AllIdsCard retailerData={getRetailerOverviewApi?.retailer} />
            )}
            {getRetailerOverviewApi?.retailer?.socialMediaURLs && true && (
              <Divider />
            )}
          </CardContent>
          {getRetailerOverviewApi?.retailer?.socialMediaURLs && true && (
            <CardActions disableSpacing>
              <SocialMedias
                socialMediaUrls={
                  getRetailerOverviewApi?.retailer?.socialMediaURLs
                }
                onlyIcons
              />
            </CardActions>
          )}
        </Card>
      </Grid>
      {/*//TODO: Temporary. Should be implemented or removed*/}
      {/* Statistic Cards and Feature Toggles (Second Column) */}
      {/*<Grid*/}
      {/*  item*/}
      {/*  container*/}
      {/*  direction="column"*/}
      {/*  justifyContent="flex-start"*/}
      {/*  alignItems="center"*/}
      {/*  xs={9}*/}
      {/*  spacing={2}*/}
      {/*>*/}
      {/*  /!* Statistic Cards Row *!/*/}
      {/*  /!* There is no data yet !!!! *!/*/}
      {/*  <Grid item container spacing={2}>*/}
      {/*    {[*/}
      {/*      `${t('backoffice.retailers.importer.create.onlineStore')}`,*/}
      {/*      `${t('backoffice.retailers.importer.create.localStore')}`*/}
      {/*    ].map((text) => (*/}
      {/*      <Grid item xs={6} key={text}>*/}
      {/*        <Card>*/}
      {/*          <CardContent>*/}
      {/*            <Stack direction="column" spacing={2}>*/}
      {/*              <Typography variant="body2">{text}</Typography>*/}
      {/*              <Typography variant="body2">0</Typography>*/}
      {/*            </Stack>*/}
      {/*          </CardContent>*/}
      {/*        </Card>*/}
      {/*      </Grid>*/}
      {/*    ))}*/}
      {/*  </Grid>*/}
      {/*  /!* Feature  Row *!/*/}
      {/*  <Grid item container spacing={2}>*/}
      {/*    <Grid item xs={12}>*/}
      {/*      <TableContainer component={Paper}>*/}
      {/*        <Table>*/}
      {/*          <TableHead>*/}
      {/*            <TableRow>*/}
      {/*              <TableCell>*/}
      {/*                {t('backoffice.retailers.importer.featureName')}*/}
      {/*              </TableCell>*/}
      {/*              <TableCell align="right">*/}
      {/*                {t('backoffice.retailers.importer.isEnabled')} ?*/}
      {/*              </TableCell>*/}
      {/*            </TableRow>*/}
      {/*          </TableHead>*/}
      {/*          <TableBody>*/}
      {/*            {retailerAttributesArray.map((row) => (*/}
      {/*              <TableRow key={row.name}>*/}
      {/*                <TableCell component="th" scope="row">*/}
      {/*                  {row.name}*/}
      {/*                </TableCell>*/}
      {/*                <TableCell align="right">*/}
      {/*                  <SeverityChip*/}
      {/*                    label={row.values}*/}
      {/*                    severity={row.values === 'No' ? 'error' : 'success'}*/}
      {/*                    size="small"*/}
      {/*                    variant="filled"*/}
      {/*                  />*/}
      {/*                </TableCell>*/}
      {/*              </TableRow>*/}
      {/*            ))}*/}
      {/*          </TableBody>*/}
      {/*        </Table>*/}
      {/*      </TableContainer>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
    </Grid>
  );
};

export default RetailerOverviewCards;
