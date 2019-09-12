const hasSkipTag = require('./utils/tags').hasSkipTag;
const hasWaitTag = require('./utils/tags').hasWaitTag;

module.exports = function addStoryBookNativeCommands({ preSnapshotFunc, postSnapshotFunc, snapshotSelector } = {}) {
  Cypress.Commands.add('openStorybookNavigator', () => {
    return cy.get('div').contains('NAVIGATOR').click();
  });

  Cypress.Commands.add('openStorybookPreview', () => {
    return cy.get('div').contains('PREVIEW').click();
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
      .openStorybookPreview()
      .wait(100); // wait for animation to finish;
  });

  Cypress.Commands.add('prepareStoryForSnapshot', () => {
    preSnapshotFunc && preSnapshotFunc();
    return cy.get('[data-testid="Storybook.OnDeviceUI.toggleUI"]').click().invoke('css', 'display', 'none');
  });

  Cypress.Commands.add('resetStoryAfterSnapshot', () => {
    postSnapshotFunc && postSnapshotFunc();
    return cy.get('[data-testid="Storybook.OnDeviceUI.toggleUI"]').invoke('css', 'display', 'block').click();
  });

  Cypress.Commands.add('runStorybookVisualRegression', () => {
    return cy
      .openStorybookNavigator()
      .getStories()
      .each((story) => {
        const name = story.attr('aria-label');
        if (!hasSkipTag(name)) {
          const wait = hasWaitTag(name);
          cy
            .loadStory(story)
            .prepareStoryForSnapshot()
            .matchesBaselineScreenshot(name, { wait, selector: snapshotSelector })
            .resetStoryAfterSnapshot();
        }
      });
  });
}
