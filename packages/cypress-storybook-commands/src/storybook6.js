const { storyInList } = require('./utils');

module.exports = function addStorybook6Commands({
  preSnapshotFunc,
  postSnapshotFunc,
  snapshotSelector,
} = {}) {
  Cypress.Commands.add('getStories', () => {
    return cy.request('/stories.json').then((response) => {
      return Object.keys(response.body.stories);
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

  Cypress.Commands.add(
    'runStorybookVisualRegression',
    ({ storiesToSkip = [], storyWaits = {}, storyActions = {}, storyList = null }) => {
      function runVisualRegression(stories) {
        stories.forEach((storyId) => {
          const [skipStory] = storyInList(storyId, storiesToSkip);
          const [hasCustomWait, customWaitMatch] = storyInList(storyId, Object.keys(storyWaits));
          const [hasPreSnapshotAction, preSnapshotActionMatch] = storyInList(storyId, Object.keys(storyActions));
          if (!skipStory) {
            cy.loadStory(storyId).prepareStoryForSnapshot();

            if (hasPreSnapshotAction) {
              storyActions[preSnapshotActionMatch]();
            }
            
            cy.matchesStorybookScreenshot(storyId, {
              selector: hasPreSnapshotAction ? 'body' : snapshotSelector,
              ...(hasCustomWait ? { wait: storyWaits[customWaitMatch] } : {}),
            }).resetStoryAfterSnapshot();
          }
        });
      }

      if (storyList) {
        // we allow passing in a storylist for parallel runs in CI
        runVisualRegression(storyList.split(','));
      } else {
        cy.getStories().then(runVisualRegression);
      }
    }
  );
};
