const { mergeConfig } = require('vite');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      fastRefresh: true,
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      base: '',
      build: {
        target: ['chrome103'],
        minify: false,
        sourcemap: false,
      },
    });
  },
};
