const path = require("path");

// this will receive the value of the task we ran
const currentTask = process.env.npm_lifecycle_event;

// plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

// configuration optimazed for development
const config = {
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  output: {
    filename: "main.[hash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    port: 6969,
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};

// prettier-ignore
if (currentTask == "build") {
  // remove the style-loader to prevent injection of CSS in JS
  config.plugins.push(new MiniCssExtractPlugin({ filename: "main.[hash].css" }), new WebpackManifestPlugin());

  // add the mini-css's loader
  config.module.rules[1].use[0] = MiniCssExtractPlugin.loader;
  config.module.rules[2].use[0] = MiniCssExtractPlugin.loader;
}

module.exports = config;
