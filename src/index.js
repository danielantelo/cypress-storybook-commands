const addStoryBookWebCommands = require('./storybook');
const addStoryBookNativeCommands = require('./storybook-native');
const addVisualSnapshotCommands = require('./visual');

module.exports = function addStoryBookCommands({
  platform = 'web',
  viewportPresets,
  registerSnapshotCommands = true
}) {
  addVisualSnapshotCommands({ viewportPresets, registerSnapshotCommands });

  switch (platform) {
    case 'web':
      addStoryBookWebCommands();
      break;
    case 'native':
      addStoryBookNativeCommands();
      break;
  }
};
