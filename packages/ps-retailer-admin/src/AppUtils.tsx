export default function getBaseUrl(): string {
  console.log(
    'Function: getBaseUrl - Line 2 - ',
    import.meta.env.VITE_REACT_APP_INSTANCE
  );
  // return import.meta.env.VITE_REACT_APP_INSTANCE === 'LOCAL'
  //   ? `http://localhost:5173`
  //   : `https://dev.unity-test.pricespy.com`;

  return `https://dev.unity-test.pricespy.com`;
}

export const DELAY_MS = 2000;
