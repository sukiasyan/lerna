import {
  ICreateOnlineStoreProps,
  IUnityCreateLocalStore,
  IUnityRetailerWithOrganization,
  StoreType
} from '~/types/Retailers';

interface FormState {
  alternatePSCodes: Array<{
    sourceSystem: string;
    sourceEntityID: string;
  }>;
}

/**
 * Updates the `alternatePSCodes` array within a given form object based on a new value and source system.
 * If a code with the matching source system exists, its `sourceEntityID` is updated. If no matching code
 * exists, a new code object is added to the array.
 */
export const handleAlternatePSCodesChange = <K extends keyof FormState>(
  form:
    | IUnityRetailerWithOrganization['retailer']
    | ICreateOnlineStoreProps
    | IUnityCreateLocalStore,
  updateFormValue: (key: K, value: FormState[K]) => void,
  sourceSystem: string,
  newValue: string
) => {
  if (form.alternatePSCodes && form.alternatePSCodes.length > 0) {
    const updatedAlternatePSCodes = form.alternatePSCodes.map((code) => {
      if (code.sourceSystem === sourceSystem) {
        return { ...code, sourceEntityID: newValue };
      }
      return code;
    });
    updateFormValue('alternatePSCodes' as K, updatedAlternatePSCodes);
  } else {
    updateFormValue('alternatePSCodes' as K, [
      { sourceSystem, sourceEntityID: newValue }
    ]);
  }
};

/**
 *  Function to map string back to StoreType safely
 * @param {string} storeType - string
 */
export const mapStringToStoreType = (storeType: string): StoreType | null => {
  const replacedStoreType = storeType.replace(' ', '_');
  if (Object.values(StoreType).includes(replacedStoreType as StoreType)) {
    return replacedStoreType as StoreType;
  }
  return null;
};

// Function to convert a string to camel case
export const toCamelCase = (str: string) => {
  return str
    ?.toLowerCase()
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};

// Convert each element to camel case
export const storeTypesCaseTypes = (storeTypes: string[]) => {
  return storeTypes.map((type) => toCamelCase(type));
};

/**
 * Handles the setting or removing of a value for a given key in a form object.
 * It abstracts the logic to work with different types of values, including
 * handling arrays specifically by removing the key if the array is empty.
 *
 * @template T - The type of the object representing the form.
 * @template K - The type of the keys of the form object.
 * @param {K} key - The key in the form object for which the value is to be set or removed.
 * @param {T[K] | null} value - The value to set for the key. If `null`, the key will be removed.
 * @param {(key: K, value: T[K]) => void} setStoreFormValue - The function to call for setting the value of a key in the form.
 * @param {(key: K) => void} remove - The function to call to remove a key from the form.
 */
export const handleAutocompleteStoreType = <T, K extends keyof T>(
  key: K,
  value: T[K] | null,
  setStoreFormValue: (key: K, value: T[K]) => void,
  remove: (key: K) => void
) => {
  if (value === null) {
    remove(key);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      remove(key);
    } else {
      setStoreFormValue(key, value);
    }
  } else {
    setStoreFormValue(key, value);
  }
};
