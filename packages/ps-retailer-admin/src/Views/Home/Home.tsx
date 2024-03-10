import { useEffect, useState } from 'react';

import getBaseUrl from '~/AppUtils';

async function GetHome(): Promise<string> {
  try {
    const baseUrl = getBaseUrl();

    const request = await fetch(`${baseUrl}/api/v1/retailers/search`);

    if (request.ok) {
      const data = await request.json();
      return data.value;
    }

    return 'An unknown error occurred';
  } catch (error) {
    console.log('GetHome :: error');
    console.log(error);
    return 'Error';
  }
}

const Home = () => {
  const [homeResponse, setHomeResponse] = useState<string>('');

  useEffect(() => {
    async function getHomeData(): Promise<void> {
      const response = await GetHome();
      console.log('response Home - ', response);
      setHomeResponse(response);
    }
    getHomeData();
  }, []);

  return (
    <div>
      <p>Home View API Response: {homeResponse}</p>
    </div>
  );
};

export default Home;
