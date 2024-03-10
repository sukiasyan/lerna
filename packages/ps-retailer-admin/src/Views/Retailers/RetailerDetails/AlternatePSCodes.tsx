import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import copy from 'copy-to-clipboard';

interface IAlternatePSCodesProps {
  sourceSystem: string;
  sourceEntityID: string;
}

const AlternatePSCodes = ({
  sourceEntityID,
  sourceSystem
}: IAlternatePSCodesProps) => {
  return (
    <Stack direction="row" spacing={2} flex={1}>
      <Typography variant="body2" color="text.secondary" paddingTop="6px">
        {sourceSystem}
      </Typography>
      <Box alignItems="center" justifyContent="end" display="flex">
        <Typography variant="body2">{sourceEntityID}</Typography>
        <IconButton onClick={() => copy(sourceEntityID)} color="primary">
          <ContentCopyIcon
            fontSize="small"
            color="action"
            sx={{ height: 16 }}
          />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default AlternatePSCodes;
