const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
