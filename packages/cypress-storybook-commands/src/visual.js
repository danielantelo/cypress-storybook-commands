const defaultViewportPresets = {
  mobile: 'iphone-x',
  desktop: 'macbook-15',
};

module.exports = function addVisualSnapshotCommands({
  viewportPresets = defaultViewportPresets,
  registerSnapshotCommands,
}) {
  if (registerSnapshotCommands) {
    const addMatchImageSnapshotCommand =
      require('cypress-image-snapshot/command').addMatchImageSnapshotCommand;
    registerSnapshotCommands &&
      addMatchImageSnapshotCommand({
        failureThreshold: 0.03,
        failureThresholdType: 'percent',
        customDiffConfig: { threshold: 0.1 },
        customDiffDir: 'cypress/__visual_diff_errors__',
      });
  }

  Cypress.Commands.add('matchesStorybookScreenshot', (name, { wait = 300, selector } = {}) => {
    cy.get(selector)
      .children()
      .should('have.length.greaterThan', 0) // should wait until children of wanted container are loaded
      .then(() => {
        Object.keys(viewportPresets).forEach((current) => {
          const viewport = viewportPresets[current];
          cy.viewport(...(Array.isArray(viewport) ? viewport : [viewport]))
            .wait(wait) // avoids capturing resize flickers or animations
            .get(selector)
            .matchImageSnapshot(`${name}-${current}`);
        });
      });
  });
};
