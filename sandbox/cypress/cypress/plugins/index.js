const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot/plugin');
const { addCrossBrowserVisualDiscrepanciesPlugin } = require('../../../../packages/cypress-storybook-commands/src/plugins');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
  addCrossBrowserVisualDiscrepanciesPlugin(on, config);
};
