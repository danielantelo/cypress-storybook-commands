const { storyInList } = require('./utils');

module.exports = function addStoryBookNativeCommands({
  preSnapshotFunc,
  postSnapshotFunc,
  snapshotSelector,
} = {}) {
  Cypress.Commands.add('openStorybookNavigator', () => {
    return cy.get('div').contains('NAVIGATOR').click().wait(100); // wait for animation to finish;
  });

  Cypress.Commands.add('openStorybookPreview', () => {
    return cy.get('div').contains('PREVIEW').click().wait(100); // wait for animation to finish
  });

  Cypress.Commands.add('getStories', () => {
    return cy.get('[data-testid="Storybook.ListView"] [data-testid]');
  });

  Cypress.Commands.add('loadStory', (story) => {
    return cy
      .openStorybookNavigator()
      .get(story)
      .scrollIntoView()
      .click({ force: true })
      .openStorybookPreview();
  });

  Cypress.Commands.add('prepareStoryForSnapshot', () => {
    preSnapshotFunc && preSnapshotFunc();
    return cy.get('[data-testid="Storybook.OnDeviceUI.toggleUI"]').click().invoke('css', 'display', 'none');
  });

  Cypress.Commands.add('resetStoryAfterSnapshot', () => {
    postSnapshotFunc && postSnapshotFunc();
    return cy.get('[data-testid="Storybook.OnDeviceUI.toggleUI"]').invoke('css', 'display', 'block').click();
  });

  Cypress.Commands.add('runStorybookVisualRegression', ({ storiesToSkip = [], storyWaits = {} }) => {
    return cy
      .openStorybookNavigator()
      .getStories()
      .each((story) => {
        const id = story.attr('data-testid').replace('Storybook.ListItem.', '');
        const [skipStory] = storyInList(storyId, storiesToSkip);
        const [hasCustomWait, customWaitMatch] = storyInList(storyId, Object.keys(storyWaits));
        if (!skipStory) {
          cy.loadStory(story)
            .prepareStoryForSnapshot()
            .matchesStorybookScreenshot(storyId, {
              selector: snapshotSelector,
              ...(hasCustomWait ? { wait: storyWaits[customWaitMatch] } : {}),
            })
            .resetStoryAfterSnapshot();
        }
      });
  });
};
