import { GridFilterItem } from '@mui/x-data-grid-pro';

export interface IUnityAlternatePSCodes {
  sourceSystem: string;
  sourceEntityID: string;
}

interface ICreatedModified {
  source: string;
  userId: string;
  traceID: string;
  spanID: string;
}

export type IUnitySocialMediaTypes =
  | 'Facebook'
  | 'Instagram'
  | 'X'
  | 'facebook'
  | 'instagram'
  | 'x';

export interface IUnitySocialMediaURL {
  platform: IUnitySocialMediaTypes;
  url: string;
}

export interface IUnityRetailerAttributes {
  bopis?: string;
  addToCart?: string;
}

export interface IUnityRetailersRequest {
  filters?: GridFilterItem[];
  sort?: {
    columnName: string;
    direction: string;
  };
  limit?: number;
  offset?: number;
}

export interface IUnityRetailer {
  PSRTID: string;
  name: string;
  domain: string;
  status: IUnityStatus;
  PSOID: string;
  countryCode: string;
  socialMediaURLs?: IUnitySocialMediaURL[];
  logoURLs?: string[] | null;
  alternatePSCodes?: IUnityAlternatePSCodes[];
  languageCodes?: string[];
  PSAID?: string;
  retailerAttributes?: IUnityRetailerAttributes;
  revision: 0;

  modifiedTimestamp: string;
  createdTimestamp: string;
  modifiedBy: ICreatedModified;
  createdBy: ICreatedModified;
}

export interface IUnityRetailerResponse {
  items: IUnityRetailer[];
  totalCount: number;
}

export interface IUnityEditRetailerResponse {
  psrtId: string;
  name: string;
  duplicateData?: {
    duplicateDomain: string;
    duplicateName: string;
    duplicateCountry: string;
  };
}

export interface ICreateRetailer {
  logoURLs: string[];
  name: string;
  countryCode: string;
  PSOID: string;
  languageCodes: string[];
  socialMediaURLs: IUnitySocialMediaURL[];
  domain: string;
  status: string;
  retailerAttributes: {
    bopis: string;
    addToCart: string;
  };
}

export enum IUnityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED_'
}

export enum StoreType {
  AUCTION = 'AUCTION',
  DISTRIBUTOR = 'DISTRIBUTOR',
  FULFILLMENT_CENTER = 'FULFILLMENT_CENTER',
  LOCAL_STORE = 'LOCAL_STORE',
  MARKETPLACE = 'MARKETPLACE',
  ONLINE_STORE = 'ONLINE_STORE',
  SHOWROOM = 'SHOWROOM'
}

export interface IUnityDataSources {
  sourceType: string;
  source: string;
  method: string;
  currencyCode: string;
  languageCode: string;
}

interface IUnityOnlineStoreTracing {
  createdSource: string;
  createdTimestamp: string;
  createdUserID: string;
  modifiedSource: string;
  modifiedTimestamp: string;
  modifiedUserID: string;
  traceID: string;
}

export interface IUnityOnlineStoreOverview {
  PSROSID: string;
  PSRTID: string;
  name: string;
  domain: string;
  siteID: string;
  currencies: { code: string; default: boolean }[];
  languageCodes: string[];
  alternatePSCodes: IUnityAlternatePSCodes[];
  storeType: StoreType;
  dataSources: IUnityDataSources[] | null;
  contactTokens: null;
  retailerTags: IUnityRetailerTag[];
  status: IUnityStatus;
  revision: number;
  tracing: IUnityOnlineStoreTracing;
}

export interface IUnityRetailerTag {
  tagType: string;
  primary: boolean;
  tags: string[];
}

export interface ICreateOnlineStoreComplete {
  name: string;
  domain: string;
  siteID: string | null;
  currencies: {
    code: string;
    default: boolean;
  }[];
  languageCodes: string[];
  storeType: StoreType;
  dataSources: IUnityDataSources[];
  alternatePSCodes: IUnityAlternatePSCodes[];
  contactTokens: string[];
  retailerTags?: IUnityRetailerTag[];
  status: string;
}

// Type for payload with only retailerTags
export interface ICreateOnlineStoreTagsOnly {
  retailerTags: IUnityRetailerTag[];
}

// Type for the complete payload including other properties
export interface ICreateOnlineStoreProps extends ICreateOnlineStoreComplete {
  retailerTags?: IUnityRetailerTag[];
}

// The combined type using a union of the two payload types
export type ICreateOnlineStorePayload =
  | ICreateOnlineStoreComplete
  | ICreateOnlineStoreTagsOnly;

export interface IUnityStoreAddress {
  name?: string;
  street1: string;
  street2?: string;
  city: string;
  stateOrProvidence: string;
  postalCode: string;
}

export interface IUnityGeoCodes {
  latitude: number;
  longitude: number;
}

export interface IUnityLocalStoreOverview {
  status: string;
  modifiedTimestamp: string;
  createdTimestamp: string;
  modifiedBy: ICreatedModified;
  createdBy: ICreatedModified;
  revision: number;
  PSRTID: string;
  storeExternalID: string;
  dataSources: IUnityDataSources[];
  alternatePSCodes: IUnityAlternatePSCodes[];
  name: string;
  address: IUnityStoreAddress;
  phone: string;
  geoCode: IUnityGeoCodes;
  storeHours: string[];
  socialMediaURLs: IUnitySocialMediaURL[];
  storeType: StoreType;
  contactTokens: string[];
  PSRLSID: string;
}

export interface IUnityCreateLocalStore {
  PSRLSID: string;
  storeExternalID: string;
  dataSources: IUnityDataSources[];
  alternatePSCodes: IUnityAlternatePSCodes[];
  name: string;
  address: IUnityStoreAddress;
  phone: string;
  geoCode: IUnityGeoCodes;
  storeHours: string[];
  socialMediaURLs: IUnitySocialMediaURL[];
  storeType: StoreType;
  contactTokens: string[];
  status: string;
}

export interface IUnityOrganization {
  status: string;
  modifiedTimestamp: string;
  createdTimestamp: string;
  modifiedBy: {
    source: string;
    userId: string;
    traceID: string;
    spanID: string;
  };
  createdBy: {
    source: string;
    userId: string;
    traceID: string;
    spanID: string;
  };
  revision: number;
  name: number;
  domain: number;
  logoURLs: string[];
  contactTokens: string[];
  alternatePSCodes: [
    {
      sourceSystem: string;
      sourceEntityID: string;
    }
  ];
  PSOID: string;
}

export interface IUnityRetailerWithOrganization {
  retailer: IUnityRetailer;
  organization?: IUnityOrganization;
}
