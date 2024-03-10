import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { LicenseInfo } from '@mui/x-license-pro';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RetailerDrawer } from './RetailerDrawer';

import { useGetMuiLicenseQuery } from '~/Store';
import {
  HeaderActionsStyled,
  ModuleBodyStyled,
  ModuleHeaderStyled,
  RetailersComponentStyled
} from '~/Views/Retailers/RetailersStyles.tsx';
import RetailersTable from '~/Views/Retailers/RetailersTable.tsx';

export default function Retailers() {
  // Aliases
  const { t } = useTranslation();

  // Local State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRetailerDrawerOpen, setIsRetailerDrawerOpen] = useState(false);

  const { data: licenseData, error: licenseError } = useGetMuiLicenseQuery();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateRetailer = () => {
    setIsRetailerDrawerOpen(true);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (licenseData) {
      LicenseInfo.setLicenseKey(licenseData.licenseKey);
    }
  }, [licenseData]);

  useEffect(() => {
    if (licenseError) {
      console.error('Error fetching license key:', licenseError);
    }
  }, [licenseError]);

  return (
    <RetailersComponentStyled>
      <ModuleHeaderStyled>
        <Typography
          variant={isRetailerDrawerOpen ? 'h6' : 'h5'}
          color="text.primary"
        >
          {isRetailerDrawerOpen
            ? t('backoffice.retailers.importer.create.newRetailer')
            : t('backoffice.retailers.header')}
        </Typography>
        {!isRetailerDrawerOpen && (
          <HeaderActionsStyled>
            <Button
              variant="contained"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
            >
              {t('backoffice.common.new')}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleCreateRetailer}>
                {t('backoffice.common.retailer')}
              </MenuItem>
              {/*<MenuItem onClick={handleCreateRetailer}>*/}
              {/*  {t('backoffice.common.organization')}*/}
              {/*</MenuItem>*/}
            </Menu>
          </HeaderActionsStyled>
        )}
      </ModuleHeaderStyled>

      <ModuleBodyStyled>
        <RetailersTable />
        <RetailerDrawer
          open={isRetailerDrawerOpen}
          onClose={() => setIsRetailerDrawerOpen(false)}
        />
      </ModuleBodyStyled>
    </RetailersComponentStyled>
  );
}
