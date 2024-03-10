import { IUnityCreateLocalStore } from '~/types/Retailers';

/**
 We need this method to create nested object in case of we have something like dataSources.methodName -> dataSources: {methodName: someValue}
 in case of it is not nested property no changes  -> name -> name
 For storeHours, BE is not supporting key value structure, but array of string, we should convert it to array af string and keep
 formatting comparable for openStreetMap format
 * **/
export const transformRequest = (input: IUnityCreateLocalStore) => {
  const transformedObject: any = {};

  for (const [key, value] of Object.entries(input)) {
    if (key.includes('.')) {
      // Handle nested properties
      const nestedKeys = key.split('.');
      let nestedObject = transformedObject;

      for (let i = 0; i < nestedKeys.length - 1; i++) {
        const nestedKey = nestedKeys[i];
        nestedObject[nestedKey] = nestedObject[nestedKey] || {};
        nestedObject = nestedObject[nestedKey];
      }

      nestedObject[nestedKeys[nestedKeys.length - 1]] = value;
    } else {
      // Handle non-nested properties
      transformedObject[key] = value;
    }
  }

  if (
    transformedObject.storeHours !== undefined &&
    !Array.isArray(transformedObject.storeHours)
  ) {
    transformedObject.storeHours = [transformedObject.storeHours];
  }

  return transformedObject;
};
