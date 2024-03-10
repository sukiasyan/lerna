import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRouteError
} from 'react-router-dom';

import '~/i18n/i18n';

import { store } from '~/Store/store';
import RetailerDetails from '~/Views/Retailers/RetailerDetails';
import Retailers from '~/Views/Retailers/Retailers';

export const RetailerApp = () => {
  function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    // Uncaught ReferenceError: path is not defined
    return <div>Dang!</div>;
  }

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={null} errorElement={<ErrorBoundary />} />
          <Route
            path="/retailers/search"
            element={<Retailers />}
            errorElement={<ErrorBoundary />}
          />
          <Route path="/retailerDetails" element={<RetailerDetails />} />
        </Routes>
      </Router>
    </Provider>
  );
};
