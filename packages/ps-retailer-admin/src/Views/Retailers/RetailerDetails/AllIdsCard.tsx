import { useTranslation } from 'react-i18next';

import AlternatePSCodes from './AlternatePSCodes';

import { IUnityOnlineStoreOverview, IUnityRetailer } from '~/types/Retailers';

interface IAllIdsCardProps {
  retailerData?: IUnityRetailer;
  storeData?: IUnityOnlineStoreOverview;
  showOnlyAlternates?: boolean;
}

const AllIdsCard = ({
  retailerData,
  storeData,
  showOnlyAlternates = false
}: IAllIdsCardProps) => {
  const { t } = useTranslation();

  return (
    <>
      {!showOnlyAlternates &&
        retailerData &&
        AlternatePSCodes({
          sourceSystem: 'PSRTID (' + t('backoffice.common.retailer') + ' ID)',
          sourceEntityID: retailerData?.PSRTID || ''
        })}

      {(retailerData?.alternatePSCodes || storeData?.alternatePSCodes)?.map(
        (code, index) => <AlternatePSCodes key={index} {...code} />
      )}
    </>
  );
};

export default AllIdsCard;
