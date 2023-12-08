const { name, version, repository } = require('./package.json')
const { styles, theme } = require('./styleguide.styles')

module.exports = {
  title: `${name} v${version}`,
  ribbon: {
    url: repository,
    text: 'View on GitHub',
  },
  styles,
  theme,
  components: [
    'src/libs/AddRow/AddTsvRow.jsx',
    'src/libs/DeleteRow/DeleteTsvRow.jsx',
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  },
}