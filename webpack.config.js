const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const isProduction =
  process.argv[process.argv.indexOf("--mode") + 1] === "production";

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
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

const srcDir = path.resolve(__dirname, "src");
const files = fs.readdirSync(srcDir);
const apps = files.filter((file) => /^\d{3}/.test(file));

const configs = [
  {
    ...common,
    name: "main",
    entry: path.resolve(__dirname, "src", "index.ts"),
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      filename: "main.js",
    },
    plugins: [
      new HtmlWebpackPlugin({ title: "WebGL2 Study" }),
      new MiniCssExtractPlugin({ filename: "[name].css" }),
      new webpack.DefinePlugin({
        "process.env": {
          APPS: JSON.stringify(apps),
        },
      }),
    ],
    devServer: {
      static: path.join(__dirname, "dist"),
      open: true,
    },
  },
];

for (const file of apps) {
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
      plugins: [
        new HtmlWebpackPlugin(htmlWebpackConfig),
        new MiniCssExtractPlugin({ filename: "bundle.css" }),
      ],
    });

    configs.push(config);
  }
}

module.exports = configs;
