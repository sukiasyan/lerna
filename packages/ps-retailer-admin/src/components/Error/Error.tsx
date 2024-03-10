import { useTranslation } from 'react-i18next';

export const Error = () => {
  const { t } = useTranslation();

  return <p>{t('backoffice.common.unknownError')}</p>;
};
