// Logic for updating form based on dataSourcesData
import { IUnityDataSources } from '~/types/Retailers';
import { IDataSourceValueProps } from '~/Views/Retailers/DataSources.tsx';

export const transformDataSource = (
  dataSourcesData: IDataSourceValueProps[]
) => {
  return dataSourcesData
    .filter((child) => Object.values(child).some((value) => value !== ''))
    .map((child) => {
      const transformedChild: Partial<IUnityDataSources> = {};

      for (const key in child) {
        if (
          key.startsWith('dataSources.') &&
          child[key as keyof IDataSourceValueProps] !== ''
        ) {
          const transformedKey = key.replace(
            'dataSources.',
            ''
          ) as keyof IUnityDataSources;

          // Only add non-empty values to transformedChild
          if (child[key as keyof IDataSourceValueProps] !== '') {
            transformedChild[transformedKey] = child[
              key as keyof IDataSourceValueProps
            ] as string;
          }
        }
      }

      return transformedChild as IUnityDataSources;
    });
};
