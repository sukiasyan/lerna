import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

import { RetailerApp } from './Retailers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RetailerApp />
  </React.StrictMode>
);
