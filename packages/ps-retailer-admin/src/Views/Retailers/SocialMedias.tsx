// Import the necessary icons
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Card, Grid, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

import {
  IUnitySocialMediaTypes,
  IUnitySocialMediaURL
} from '~/types/Retailers';

// Map the platform names to the corresponding icon components
const platformIcons: Record<IUnitySocialMediaTypes, JSX.Element> = {
  Facebook: <FacebookOutlinedIcon />,
  Instagram: <InstagramIcon />,
  X: <TwitterIcon />,
  facebook: <FacebookOutlinedIcon />,
  instagram: <InstagramIcon />,
  x: <TwitterIcon />
};

const SocialMedias = ({
  socialMediaUrls,
  onlyIcons
}: {
  socialMediaUrls: IUnitySocialMediaURL[];
  onlyIcons?: boolean;
}) => {
  const { t } = useTranslation();

  const SocialIcons = () => (
    <Grid container alignItems="center" spacing={2}>
      {!onlyIcons && (
        <Grid item>
          <Typography variant="body2">
            {t('backoffice.common.socialMedia')}
          </Typography>
        </Grid>
      )}
      <Grid item>
        {!socialMediaUrls || socialMediaUrls.length === 0 ? (
          <Box padding={1.3}>-</Box>
        ) : (
          socialMediaUrls?.map((media) => {
            const Icon = platformIcons[media.platform];
            return (
              <IconButton
                key={media.platform}
                onClick={() => window.open(media.url, '_blank')}
              >
                {Icon}
              </IconButton>
            );
          })
        )}
      </Grid>
    </Grid>
  );

  if (onlyIcons) return <SocialIcons />;
  return (
    <Card sx={{ py: 0.5, px: 2 }}>
      <SocialIcons />
    </Card>
  );
};

export default SocialMedias;
