module.exports = function addStoryBookWebCommands() {
  Cypress.Commands.add('getStories', () => {

  });

  Cypress.Commands.add('loadStory', (story) => {

  });

  Cypress.Commands.add('runStorybookVisualRegression', () => {
    return cy
      .getStories()
      .each((story) => {
        cy
          .loadStory(story)
          .matchesBaselineScreenshot(story.attr('data-testid'));
      });
  });
}
