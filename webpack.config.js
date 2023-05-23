const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  //   devServer: {
  //     static: {
  //       directory: path.resolve(__dirname, "dist"),
  //     },
  //     port: 3000,
  //     open: true,
  //     hot: true,
  //     compress: true,
  //     historyApiFallback: true,
  //   },
  devServer: {
    watchFiles: ["src/**/*"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "src/index.html", to: "index.html" }],
    }),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/tv_shows.html",
      inject: true,
      chunks: ["index"],
      filename: "tv_shows.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/search_results.html",
      inject: true,
      chunks: ["index"],
      filename: "search_results.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/movie_details.html",
      inject: true,
      chunks: ["index"],
      filename: "movie_details.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/tv_shows_details.html",
      inject: true,
      chunks: ["index"],
      filename: "tv_shows_details.html",
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
