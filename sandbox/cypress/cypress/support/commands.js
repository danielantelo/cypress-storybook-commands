import addStoryBookCommands from '../../../../packages/cypress-storybook-commands';

addStoryBookCommands({
  version: 7,
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
});
