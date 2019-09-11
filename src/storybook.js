const hasSkipTag = require('./utils/tags').hasSkipTag;
const hasWaitTag = require('./utils/tags').hasWaitTag;

module.exports = function addStoryBookWebCommands({ preSnapshotFunc, postSnapshotFunc } = {}) {
  Cypress.Commands.add('expandAll', () => {
    let didExpand = false;
    return cy
      .get('a[id^=explorer]:not([href])')
      .each(story => {
        const isExpanded = story.parent().find(`#${story.attr('id')} + .css-0`).length > 0;
        if (!isExpanded) {
          cy
            .get(story)
            .scrollIntoView()
            .click({ force: true });
          didExpand = true;
        }
      })
      .then(() => {
        // if we expanded any stories lets check for inner stories to expand
        didExpand && cy.expandAll();
      })
  });

  Cypress.Commands.add('getStories', () => {
    return cy
      .expandAll()
      .then(() => {
        return cy.get('a[id^=explorer][href]')
      });
  })

  Cypress.Commands.add('loadStory', id => {
    return cy.visit(`/iframe.html?id=${id}`);
  });

  Cypress.Commands.add('prepareStoryForSnapshot', () => {
    preSnapshotFunc && preSnapshotFunc();
  });

  Cypress.Commands.add('resetStoryAfterSnapshot', () => {
    postSnapshotFunc && postSnapshotFunc();
  });

  Cypress.Commands.add('runStorybookVisualRegression', () => {
    return cy
      .getStories()
      .each((story) => {
        const name = story.attr('title');
        if (!hasSkipTag(name)) {
          const wait = hasWaitTag(name);
          const storyId = story.attr('id').replace(/^(explorer)/, '');
          cy
            .loadStory(storyId)
            .prepareStoryForSnapshot()
            .matchesBaselineScreenshot(storyId, { wait })
            .resetStoryAfterSnapshot();
        }
      });
  });
}
