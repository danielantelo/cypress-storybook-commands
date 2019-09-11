const addStoryBookWebCommands = require('./storybook');
const addStoryBookNativeCommands = require('./storybook-native');
const addVisualSnapshotCommands = require('./visual');

module.exports = function addStoryBookCommands({
  version = 5,
  platform = 'web',
  viewportPresets,
  registerSnapshotCommands = true,
  preSnapshotFunc,
  postSnapshotFunc,
} = {}) {
  addVisualSnapshotCommands({ viewportPresets, registerSnapshotCommands });

  switch (platform) {
    case 'web':
      addStoryBookWebCommands({ preSnapshotFunc, postSnapshotFunc });
      break;
    case 'native':
      addStoryBookNativeCommands({ preSnapshotFunc, postSnapshotFunc });
      break;
  }
};
