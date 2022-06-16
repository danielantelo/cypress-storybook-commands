context('Storybook', () => {
  it('render components as expected', () => {
    cy.visit('/').runStorybookVisualRegression({
      storiesToSkip: ['chart-chart--column-chart-grouped'],
      storyWaits: { 'chart-chart--': 1000 },
    });
  });
});
