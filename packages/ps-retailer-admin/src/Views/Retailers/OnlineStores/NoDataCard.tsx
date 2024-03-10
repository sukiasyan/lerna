import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Card } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import noDataImg from '~/assets/no-data-art.png';
import { IUnityOnlineStoreOverview } from '~/types/Retailers';
import { NoDataContentStyled } from '~/Views/Retailers/RetailerDetails/RetailerDetailsStyles.tsx';

interface INoDataStoreProps {
  primaryStore: IUnityOnlineStoreOverview | undefined;
  setOpenOnlineStoreDrawer: Dispatch<SetStateAction<boolean>>;
}

export const NoDataCard = ({
  primaryStore,
  setOpenOnlineStoreDrawer
}: INoDataStoreProps) => {
  //Aliases
  const { t } = useTranslation();

  return (
    <Card>
      <NoDataContentStyled>
        <img
          src={noDataImg}
          alt={
            t('backoffice.retailers.importer.create.noStoreAvailable') as string
          }
        />
        {t('backoffice.retailers.importer.create.noStoreAvailable')}
        {!primaryStore && (
          <Button
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setOpenOnlineStoreDrawer(true)}
          >
            {t('backoffice.retailers.importer.create.add1PStore')}
          </Button>
        )}
      </NoDataContentStyled>
    </Card>
  );
};

export default NoDataCard;
