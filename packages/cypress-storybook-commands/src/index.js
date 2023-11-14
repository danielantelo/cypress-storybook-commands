const addStorybookCommands = require('./storybook');
const addStorybook5Commands = require('./storybook5');
const addStoryBookNativeCommands = require('./storybook-native');
const addVisualSnapshotCommands = require('./visual');

module.exports = function addStoryBookCommands({
  version = 7,
  viewportPresets,
  registerSnapshotCommands = true,
  preSnapshotFunc,
  postSnapshotFunc,
  snapshotSelector,
} = {}) {
  addVisualSnapshotCommands({ viewportPresets, registerSnapshotCommands });

  switch (String(version)) {
    case '7':
      addStorybookCommands({
        preSnapshotFunc,
        postSnapshotFunc,
        snapshotSelector: snapshotSelector || '#storybook-root',
      });
      break;
    case '6':
      addStorybookCommands({
        preSnapshotFunc,
        postSnapshotFunc,
        snapshotSelector: snapshotSelector || '#root',
      });
      break;
    case '5':
      addStorybook5Commands({
        preSnapshotFunc,
        postSnapshotFunc,
        snapshotSelector,
      });
      break;
    case 'native':
      addStoryBookNativeCommands({
        preSnapshotFunc,
        postSnapshotFunc,
        snapshotSelector,
      });
      break;
  }
};
