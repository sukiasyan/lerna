import { SeverityChip } from '~/components/SeverityChip/SeverityChip';
import { SeverityIcon } from '~/components/SeverityIcon/SeverityIcon';
import { IUnityStatus } from '~/types/Retailers';

interface IStatusProps {
  value: IUnityStatus;
  small?: boolean;
}

const StatusIndicator = ({ value, small }: IStatusProps) => {
  const getSeverity = () => {
    switch (value) {
      case IUnityStatus.ACTIVE:
        return 'success';
      case IUnityStatus.DELETED:
        return 'error';
      default:
        return undefined;
    }
  };

  const getLabel = () => {
    switch (value) {
      case IUnityStatus.ACTIVE:
        return IUnityStatus.ACTIVE;
      case IUnityStatus.DELETED:
        return IUnityStatus.DELETED.replace('_', '');
      case IUnityStatus.INACTIVE:
        return IUnityStatus.INACTIVE;
      default:
        return (value as string).toUpperCase();
    }
  };

  return (
    <SeverityChip
      size="small"
      variant="outlined"
      icon={<SeverityIcon severity={getSeverity()} />}
      label={getLabel()}
      severity={getSeverity()}
      sx={{ height: small ? 20 : 24 }}
    />
  );
};

export default StatusIndicator;
