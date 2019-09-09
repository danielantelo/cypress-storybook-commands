module.exports = function addStoryBookNativeCommands() {
  Cypress.Commands.add('openStorybookNavigator', () => {
    return cy.get('.css-text-901oao').contains('NAVIGATOR').click();
  });

  Cypress.Commands.add('openStorybookPreview', () => {
    return cy.get('.css-text-901oao').contains('PREVIEW').click();
  });

  Cypress.Commands.add('getStories', () => {
    return cy.get('[data-testid="Storybook.ListView"] [data-testid]');
  });

  Cypress.Commands.add('loadStory', (story) => {
    return cy
      .openStorybookNavigator()
      .get(story)
      .scrollIntoView()
      .click()
      .openStorybookPreview()
      .wait(100) // wait for animation to finish;
  });

  Cypress.Commands.add('runStorybookVisualRegression', () => {
    return cy
      .openStorybookNavigator()
      .getStories()
      .each((story) => {
        cy
          .loadStory(story)
          .matchesBaselineScreenshot(story.attr('data-testid'));
      });
  });
}
