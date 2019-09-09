const defaultViewportPresets = {
  mobile: 'iphone-6',
  tablet: 'ipad-2',
  desktop: 'macbook-15'
};

module.exports = function addVisualSnapshotCommands({ viewportPresets = defaultViewportPresets, registerSnapshotCommands }) {
  if (registerSnapshotCommands) {
    const addMatchImageSnapshotCommand = require('cypress-image-snapshot/command').addMatchImageSnapshotCommand;
    registerSnapshotCommands && addMatchImageSnapshotCommand({
      failureThreshold: 0.03,
      failureThresholdType: 'percent',
      customDiffConfig: { threshold: 0.1 },
      customDiffDir: 'cypress/__visual_diff_errors__'
    });
  };

  Cypress.Commands.add('matchesBaselineScreenshot', (name, { selector = 'body' } = {}) => {
    Object.keys(viewportPresets).forEach((current) => {
      const viewport = viewportPresets[current];
      cy.viewport(...(Array.isArray(viewport) ? viewport : [viewport]))
        .wait(250) // avoid capturing resize flickers
        .get(selector)
        .then(() => {
          cy.matchImageSnapshot(`${name}-${current}`);
        });
    });
  });
};
