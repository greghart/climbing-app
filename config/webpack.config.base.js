// Common Webpack configuration used by webpack.config.development and webpack.config.production

import path from "path";
import webpack from "webpack";

export default {
  output: {
    filename: "js/[name].js",
    path: path.resolve(import.meta.dirname, "../build"),
    chunkFilename: "[name].bundle.js",
    publicPath: "/build",
  },
  resolve: {
    modules: [
      "node_modules",
      path.join(import.meta.dirname, "../dist/typescript"),
      path.join(import.meta.dirname, "../src/scss"),
    ],
    alias: {},
    extensions: [
      ".webpack.js",
      ".web.js",
      ".ts",
      ".tsx",
      ".json",
      ".scss",
      ".css",
      ".js",
    ],
  },
  // optimization: {
  //   splitChunks: {

  //   }
  // },
  plugins: [
    // Direct typescript to a browser compatible
    new webpack.NormalModuleReplacementPlugin(/swagger-client$/, function (
      result
    ) {
      result.request = result.request.replace(
        /swagger-client/,
        "swagger-client/browser"
      );
    }),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /react-native-sqlite-storage$/,
    }),
    // new webpack.ProvidePlugin({
    //   'window.SQL': '{}' // 'sql.js/dist/sql-wasm.js'
    // }),
    new webpack.NormalModuleReplacementPlugin(/getServiceClient/, function (
      resource
    ) {
      resource.request = resource.request.replace(
        /getServiceClient/,
        "getSwaggerClient"
      );
    }),
    // Provide globals we expect/setup through HtmlComponent
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"],
    }),
  ],
  module: {
    rules: [
      {
        test: /dist.*\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: "esnext",
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
              },
            },
          },
        ],
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/inline",
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 8192,
        //       name: 'images/[name].[ext]?[hash]'
        //     }
        //   }
        // ]
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/inline",
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 8192,
        //       name: 'fonts/[name].[ext]?[hash]'
        //     }
        //   }
        // ]
      },
    ],
  },
};
