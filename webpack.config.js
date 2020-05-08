const createStyleLoaders = (isProduction) => [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      sourceMap: !isProduction,
      modules: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [require('autoprefixer'), require('postcss-clean')],
    },
  },
];

module.exports = (env) => ({
  mode: 'production',
  entry: ['./src/App.ts'],
  output: {
    publicPath: '/',
    path: `${__dirname}/build/`,
    filename: 'bundle.js',
  },
  resolve: {
    // importする拡張子の指定
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
  // loaderの設定
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: createStyleLoaders(env.production),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          ...createStyleLoaders(env.production),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !env.production,
            },
          },
        ],
      },
    ],
  },
});
