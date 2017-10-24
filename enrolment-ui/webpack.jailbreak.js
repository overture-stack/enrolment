// Using jailbreak-react-scripts merge to add support for things like SCSS

const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function jailbreakWebpackConfig(config) {
  const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: process.env.NODE_ENV === 'development'
  });

  const scssLoaderConfig = {
    test: /\.scss$/,
    use: extractSass.extract({
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ],
      // use style-loader in development
      fallback: 'style-loader'
    })
  };

  let newConfig = merge.smart(config, {
    devtool: 'source-map',
    plugins: [extractSass]
  });

  newConfig.module.rules[1].oneOf.unshift(scssLoaderConfig);

  Object.assign(config, newConfig);
};
