import addStoryBookCommands from '../../../../packages/cypress-storybook-commands';

addStoryBookCommands({
  version: 'native', // currently only Storybook 5 is supported
  viewportPresets: {
    // see https://docs.cypress.io/api/commands/viewport.html#Arguments
    mobile: 'iphone-x',
    laptop: 'macbook-13',
  },
  registerSnapshotCommands: true, // false if you already include cypress-image-snapshot/command
  preSnapshotFunc: () => {
    console.log('code before snapshot: hide elements, etc');
  },
  postSnapshotFunc: () => {
    console.log('code after snapshot: reset elements, etc');
  },
  snapshotSelector: 'body', // selector of element to use for snapshots
});
