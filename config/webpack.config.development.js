import { merge } from "webpack-merge";
import webpack from "webpack";
import config from "./webpack.config.base.js";
import path from "path";

const GLOBALS = {
  "process.env": {
    NODE_ENV: JSON.stringify("development"),
  },
};

export default merge(config, {
  mode: "development",
  cache: true,
  devtool: "eval-cheap-module-source-map",
  output: {
    publicPath: "/build",
  },
  entry: {
    application: [
      "webpack-hot-middleware/client",
      "whatwg-fetch",
      // App entry point
      path.join(import.meta.dirname, "/../dist/typescript/client.js"),
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
  ],
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // Sass
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});
