module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          extensions: [
            '.ios.js',
            '.ios.jsx',
            '.android.js',
            '.android.jsx',
            '.js',
            '.jsx',
            '.json',
            '.native.js',
            '.native.jsx',
          ],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
