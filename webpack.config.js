const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

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
      new webpack.DefinePlugin({
        "process.env": {
          APPS: JSON.stringify("APPS"),
        },
      }),
    ],
    devServer: {
      static: path.join(__dirname, "dist"),
      open: true,
    },
  },
];
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

    configs.push(config);
  }
});

module.exports = configs;
