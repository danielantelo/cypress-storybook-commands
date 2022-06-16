const { storyInList } = require('./utils');

module.exports = function addStorybook6Commands({
  preSnapshotFunc,
  postSnapshotFunc,
  snapshotSelector,
} = {}) {
  Cypress.Commands.add('expandAll', () => {
    const expandableSelector = 'button[aria-expanded=false]';
    return cy
      .get(expandableSelector)
      .each((story) => {
        cy.get(story).click({ force: true });
      })
      .then(() => {
        // lets check for inner stories to expand
        if (Cypress.$(expandableSelector).length > 0) {
          return cy.expandAll();
        }
      });
  });

  Cypress.Commands.add('getStories', () => {
    return cy.expandAll().then(() => {
      return cy.get('a[data-nodetype=story]');
    });
  });

  Cypress.Commands.add('loadStory', (id) => {
    return cy.visit(`/iframe.html?id=${id}`);
  });

  Cypress.Commands.add('prepareStoryForSnapshot', () => {
    preSnapshotFunc && preSnapshotFunc();
  });

  Cypress.Commands.add('resetStoryAfterSnapshot', () => {
    postSnapshotFunc && postSnapshotFunc();
  });

  Cypress.Commands.add('runStorybookVisualRegression', ({ storiesToSkip = [], storyWaits = {} }) => {
    return cy
      .url()
      .should('include', '?path=/story/') // wait for storybook to load initial default story
      .getStories()
      .each((story) => {
        const storyId = story.attr('data-item-id');
        const [skipStory] = storyInList(storyId, storiesToSkip);
        const [hasCustomWait, customWaitMatch] = storyInList(storyId, Object.keys(storyWaits));
        if (!skipStory) {
          cy.loadStory(storyId)
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
