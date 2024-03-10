# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation

You will need to install [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) to build this package locally.

Clone the repository:

```bash
git clone git@github.com:PriceSpider-NeuIntel/unity-hub.git
```

## Application setup

You will need a `.env` environment file to run the application. After cloning the repository, create a new file
named `.env` at the repository root. enter the following into the file:

```bash
VITE_REACT_APP_INSTANCE=LOCAL
VITE_REACT_APP_API_SUBDOMAIN=integration.unity-test.pricespy.com
```

You can then source your new environment file, from the project root in terminal enter:

```bash
source .env
```

## Final Steps

Install dependencies and run the application

```bash
npm install
npm start dev
```

## Setup proxy for middle-tier

You will need to add this part to vite.config.ts

```
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Using the proxy instance
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy' so you can do whatever you want here
        }
      }
    }
  },
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  define: {
    'process.env.VITE_REACT_APP_INSTANCE': JSON.stringify(
      process.env.VITE_REACT_APP_INSTANCE
    ),
    'process.env.VITE_REACT_APP_API_SUBDOMAIN': JSON.stringify(
      process.env.VITE_REACT_APP_API_SUBDOMAIN
    )
  }
});

```
