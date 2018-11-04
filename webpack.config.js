module.exports = {
  entry: './src/app.jsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          query: { presets: ['@babel/preset-env', '@babel/preset-react'] }
        },
        exclude: /node_modules/
      }
    ]
  }
};
