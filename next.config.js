// next.config.js
// const withTypescript = require('@zeit/next-typescript')
const withTypescript = require("next-tsc");
const withCss = require('@zeit/next-css');

// TODO My changes for https://greghart.github.io/software/2019/04/16/software-code-splitting-ts.html
// actually ended up breaking next.js typescript integration.
module.exports = withTypescript({
  webpack: (config, options) => {
    config.plugins.push(
      new options.webpack.NormalModuleReplacementPlugin(/getClient/, function(resource) {
        resource.request = resource.request.replace(
          /getClient/, 
          options.isServer ? 'getServiceClient' : 'getSwaggerClient'
        );
      })
    );
    console.log(config.module.rules[1]);
    console.log(config.module.rules[1].use[1]);
    config.module.rules[1].use[1].options = {
      compilerOptions: {
        module: 'esnext',
        allowSyntheticDefaultImports: true,
      }
    };
    return config;
  }
});
