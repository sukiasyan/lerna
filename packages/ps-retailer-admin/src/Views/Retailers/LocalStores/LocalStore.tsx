import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Card } from '@mui/material';
import { Loading } from '@pricespider-neuintel/mesh';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RetailersComponentStyled } from '../RetailersStyles';

import { LocalStoresTable } from './LocalStoresTable';

import noDataImg from '~/assets/no-data-art.png';
import { ErrorAlert } from '~/components/Error/ErrorAlert';
import { useGetLocalStoreQuery, useGetMuiLicenseQuery } from '~/Store';
import { NoDataContentStyled } from '~/Views/Retailers/RetailerDetails/RetailerDetailsStyles.tsx';
import { LicenseInfo } from '@mui/x-license-pro';

interface ILocalStoreProps {
  retailerId: string | null;
  setOpenLocalStoreDrawer: Dispatch<SetStateAction<boolean>>;
  selectedRetailerName: string;
}

const LocalStore = ({
  retailerId,
  setOpenLocalStoreDrawer,
  selectedRetailerName
}: ILocalStoreProps) => {
  const { t } = useTranslation();

  const { data: licenseData, error: licenseError } = useGetMuiLicenseQuery();
  const { data, isLoading, isError, error } = useGetLocalStoreQuery({
    PSRTID: retailerId
  });

  useEffect(() => {
    if (licenseError) {
      console.error('Error fetching license key:', licenseError);
    }
  }, [licenseError]);

  useEffect(() => {
    if (licenseData) {
      LicenseInfo.setLicenseKey(licenseData.licenseKey);
    }
  }, [licenseData]);

  if (isLoading) {
    return (
      <RetailersComponentStyled>
        <Loading />
      </RetailersComponentStyled>
    );
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  if (data?.length !== 0) {
    return (
      <LocalStoresTable
        selectedRetailerName={selectedRetailerName}
        localStoreRows={data ?? []}
      />
    );
  }

  return (
    <Card>
      <NoDataContentStyled>
        <img src={noDataImg} alt={t('backoffice.common.noData') ?? ''} />
        {t('backoffice.retailers.importer.create.noStoreAvailable')}
        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={() => setOpenLocalStoreDrawer(true)}
        >
          {t('backoffice.retailers.importer.create.addLocalStore')}
        </Button>
      </NoDataContentStyled>
    </Card>
  );
};

export default LocalStore;
