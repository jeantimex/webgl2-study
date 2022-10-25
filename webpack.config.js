const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const path = require("path");

const common = {
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

const configs = [];
const srcDir = path.resolve(__dirname, "src");

fs.readdirSync(srcDir).forEach((file) => {
  const stat = fs.statSync(srcDir + "/" + file);
  if (stat.isDirectory()) {
    const htmlWebpackConfig = {
      title: file,
    };
    if (fs.existsSync(srcDir + "/" + file + "/index.html")) {
      htmlWebpackConfig.template = srcDir + "/" + file + "/index.html";
    }

    const config = Object.assign({}, common, {
      name: file,
      entry: path.resolve(__dirname, "src", file, "index.ts"),
      output: {
        path: path.resolve(__dirname, "dist", file),
        publicPath: "/" + file,
        filename: "bundle.js",
      },
      plugins: [new HtmlWebpackPlugin(htmlWebpackConfig)],
    });

    if (configs.length === 0) {
      config.devServer = {
        static: path.join(__dirname, "dist"),
      };
    }

    configs.push(config);
  }
});

module.exports = configs;
