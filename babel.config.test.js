module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
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
    ]
  ]
}; 