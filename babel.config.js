module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/src': './src',
            '@/app': './app',
            '@/components': './src/components',
            '@/contexts': './src/contexts',
            '@/services': './src/services',
            '@/hooks': './src/hooks',
            '@/theme': './src/theme',
            '@/store': './src/store',
            '@/utils': './src/utils'
          },
        },
      ],
    ],
    env: {
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript'
        ],
        plugins: [
          '@babel/plugin-transform-modules-commonjs'
        ]
      }
    }
  };
}; 