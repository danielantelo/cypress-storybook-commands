const addStorybook6Commands = require('./storybook6');
const addStorybook5Commands = require('./storybook5');
const addStoryBookNativeCommands = require('./storybook-native');
const addVisualSnapshotCommands = require('./visual');

module.exports = function addStoryBookCommands({
  version = 6,
  viewportPresets,
  registerSnapshotCommands = true,
  preSnapshotFunc,
  postSnapshotFunc,
  snapshotSelector = '#root',
} = {}) {
  addVisualSnapshotCommands({ viewportPresets, registerSnapshotCommands });

  switch (String(version)) {
    case '6':
      addStorybook6Commands({
        preSnapshotFunc,
        postSnapshotFunc,
        snapshotSelector,
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
