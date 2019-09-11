context('Visual Regression', () => {
  it('web', () => {
    cy.visit('/')
      .runStorybookVisualRegression();
  });
});
