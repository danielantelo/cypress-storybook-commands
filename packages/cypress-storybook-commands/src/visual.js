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
      require('@simonsmith/cypress-image-snapshot/command').addMatchImageSnapshotCommand;
    registerSnapshotCommands &&
      addMatchImageSnapshotCommand({
        failureThreshold: 0.005,
        failureThresholdType: 'percent',
        customDiffConfig: { threshold: 0.1 },
        customDiffDir: 'cypress/__visual_diff_errors__',
        allowSizeMismatch: true,
      });
  }

  Cypress.Commands.add('matchesStorybookScreenshot', (name, { wait = 500, selector, viewports } = {}) => {
    cy.get(selector)
      .children()
      .should('have.length.greaterThan', 0) // should wait until children of wanted container are loaded
      .then(() => {
        const viewportsObject = viewports || viewportPresets;
        Object.keys(viewportsObject).forEach((current) => {
          const viewport = viewportsObject[current];
          cy.viewport(...(Array.isArray(viewport) ? viewport : [viewport]))
            .wait(wait) // avoids capturing resize flickers or animations
            .get(selector)
            .matchImageSnapshot(`${name}-${current}`);
        });
      });
  });
};
