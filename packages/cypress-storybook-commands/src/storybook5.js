const { storyInList } = require('./utils');

module.exports = function addStorybook5Commands({
  preSnapshotFunc,
  postSnapshotFunc,
  snapshotSelector,
} = {}) {
  Cypress.Commands.add('expandAll', () => {
    let didExpand = false;
    return cy
      .get('a[id^=explorer]:not([id*=--])')
      .each((story) => {
        const isExpanded = story.parent().find(`#${story.attr('id')} + .css-0`).length > 0;
        if (!isExpanded) {
          cy.get(story).scrollIntoView().click({ force: true });
          didExpand = true;
        }
      })
      .then(() => {
        // if we expanded any stories lets check for inner stories to expand
        didExpand && cy.expandAll();
      });
  });

  Cypress.Commands.add('getStories', () => {
    return cy.expandAll().then(() => {
      return cy.get('a[id^=explorer][href][id*=--]');
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
        const storyId = story.attr('id').replace(/^(explorer)/, '');
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
