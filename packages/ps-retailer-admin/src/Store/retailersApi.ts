import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import getBaseUrl from '~/AppUtils.tsx';
import {
  ICreateOnlineStorePayload,
  ICreateOnlineStoreProps,
  IUnityCreateLocalStore,
  IUnityEditRetailerResponse,
  IUnityLocalStoreOverview,
  IUnityOnlineStoreOverview,
  IUnityRetailer,
  IUnityRetailerResponse,
  IUnityRetailersRequest,
  IUnityRetailerWithOrganization,
  IUnityStatus
} from '~/types/Retailers';
import { createApiFilter, Tag } from '~/utils/api.ts';
import { transformRequest } from '~/Views/Retailers/LocalStores/LocalStore.utils';

const baseUrl = getBaseUrl();

// Define a service using a base URL and expected endpoints
export const retailersApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: Object.values(Tag),
  endpoints: (builder) => ({
    getMuiLicense: builder.query<{ licenseKey: string }, void>({
      query: () => ({
        url: `${baseUrl}/api/getLicense`,
        method: 'GET'
      }),
      providesTags: [Tag.Retailers]
    }),
    getRetailers: builder.query<IUnityRetailerResponse, IUnityRetailersRequest>(
      {
        query: (body: IUnityRetailersRequest) => ({
          url: `${baseUrl}/api/v1/retailers/search`,
          method: 'POST',
          body: {
            ...body,
            filters: createApiFilter(body.filters)
          }
        }),
        providesTags: [Tag.Retailers]
      }
    ),
    getRetailerOverview: builder.query<
      IUnityRetailerWithOrganization,
      { PSRTID: string }
    >({
      query: ({ PSRTID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}`,
        method: 'GET'
      }),
      providesTags: [Tag.Retailers]
    }),
    updateRetailer: builder.mutation<
      IUnityEditRetailerResponse,
      { body: IUnityRetailerResponse; PSRTID: string }
    >({
      query: ({ body, PSRTID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [Tag.Retailers]
    }),

    createRetailer: builder.mutation<
      IUnityRetailer,
      { body: IUnityRetailerResponse }
    >({
      query: ({ body }) => ({
        url: `${baseUrl}/api/v1/retailers`,
        method: 'POST',
        body
      }),
      invalidatesTags: [Tag.Retailers]
    }),

    deleteOrRestoreRetailer: builder.mutation<
      void,
      { body: { status: IUnityStatus }; PSRTID: string }
    >({
      query: ({ body, PSRTID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [Tag.Retailers]
    }),
    getOnlineStore: builder.query<IUnityOnlineStoreOverview[], string>({
      query: (retailerId) => ({
        url: `${baseUrl}/api/v1/retailers/${retailerId}/onlinestores`,
        method: 'GET'
      }),
      providesTags: [Tag.Retailers]
    }),
    createOnlineStore: builder.mutation<
      ICreateOnlineStorePayload,
      { body: ICreateOnlineStoreProps; PSRTID: string }
    >({
      query: ({ body, PSRTID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/onlinestores`,
        method: 'POST',
        body
      }),
      invalidatesTags: [Tag.Retailers]
    }),
    updateOnlineStore: builder.mutation<
      void,
      { body: ICreateOnlineStorePayload; PSRTID: string; PSROSID: string }
    >({
      query: ({ body, PSRTID, PSROSID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/onlinestores/${PSROSID}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [Tag.Retailers]
    }),
    deleteOrRestoreOnlineStore: builder.mutation<
      void,
      { status: IUnityStatus; PSRTID: string; PSROSID: string }
    >({
      query: ({ status, PSRTID, PSROSID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/onlinestores/${PSROSID}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: [Tag.Retailers]
    }),

    getLocalStore: builder.query<
      IUnityLocalStoreOverview[],
      { PSRTID: string | null }
    >({
      query: ({ PSRTID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/localstores`,
        method: 'GET'
      }),
      providesTags: [Tag.LocalStores]
    }),

    createLocalStore: builder.mutation<
      IUnityCreateLocalStore,
      { body: IUnityCreateLocalStore; PSRTID: string }
    >({
      query: ({ body, PSRTID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/localstores`,
        method: 'POST',
        body: transformRequest(body)
      }),
      invalidatesTags: [Tag.Retailers, Tag.LocalStores]
    }),

    updateLoacalStore: builder.mutation<
      IUnityCreateLocalStore,
      { body: IUnityCreateLocalStore; PSRTID: string; PSRLSID: string }
    >({
      query: ({ body, PSRTID, PSRLSID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/localstores/${PSRLSID}`,
        method: 'PATCH',
        body: transformRequest(body)
      }),
      invalidatesTags: [Tag.Retailers, Tag.LocalStores]
    }),

    deleteOrRestoreLocalStore: builder.mutation<
      void,
      { body: { status: IUnityStatus }; PSRTID: string; PSRLSID: string }
    >({
      query: ({ body, PSRTID, PSRLSID }) => ({
        url: `${baseUrl}/api/v1/retailers/${PSRTID}/localstores/${PSRLSID}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [Tag.Retailers, Tag.LocalStores]
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMuiLicenseQuery,
  useGetRetailersQuery,
  useGetRetailerOverviewQuery,
  useUpdateRetailerMutation,
  useCreateRetailerMutation,
  useDeleteOrRestoreRetailerMutation,
  useGetOnlineStoreQuery,
  useCreateOnlineStoreMutation,
  useUpdateOnlineStoreMutation,
  useDeleteOrRestoreOnlineStoreMutation,
  useGetLocalStoreQuery,
  useCreateLocalStoreMutation,
  useUpdateLoacalStoreMutation,
  useDeleteOrRestoreLocalStoreMutation
} = retailersApi;
