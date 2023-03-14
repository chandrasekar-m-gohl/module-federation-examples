const NextFederationPlugin = require('@module-federation/nextjs-mf');
const {NextMedusaPlugin} = require("@module-federation/dashboard-plugin");
// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    home: `home@http://localhost:3001/_next/static/${location}/remoteEntry.js`,
    shop: `shop@http://localhost:3002/_next/static/${location}/remoteEntry.js`,
    checkout: `checkout@http://localhost:3000/_next/static/${location}/remoteEntry.js`,
  };
};

const timestamp = Date.now();
module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shop',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './shop': './pages/shop.js',
          './pdp': './pages/p/[...slug].js',
          './pages-map': './pages-map.js',
        },
        remotes: remotes(options.isServer),
        shared: {},
        extraOptions:{
          automaticAsyncBoundary: true
        },
      }),
      new NextMedusaPlugin({
        debug:false,
        // versionStrategy: timestamp,
        versionStrategy: 'gitSha', //use commit hash as unique ID
        filename: 'dashboard.json',
        dashboardURL: `https://api-dev.medusa.codes/update?token=b99d41da-fc30-405a-94b2-f37266882959`,
        metadata: {
          baseUrl: 'http://localhost:3002/_next/static/chunks/',
          source: {
            url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/home',
          },
          remote: 'http://localhost:3001/_next/static/chunks/remoteEntry.js',
        },
      })
    );

    return config;
  },
};
