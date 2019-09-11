import addStoryBookCommands from '../../../src/index';

addStoryBookCommands({
  version: 5,
  platform: 'native',
  viewportPresets: {
    mobile: 'iphone-6',
    laptop: 'macbook-13',
  },
  registerSnapshotCommands: true,
  preSnapshotFunc: () => {
    // cy.get('[data-automation="story-theme"]').invoke('css', 'display', 'none');
    // cy.get('[data-automation="story-header"]').invoke('css', 'display', 'none');
    // cy.log('code before snapshot: hide elements, etc')
    cy.wait(5000)
  },
  postSnapshotFunc: () => {
    // cy.log('code after snapshot: reset elements, etc')
    cy.wait(5000)
  },
});
