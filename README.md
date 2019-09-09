# Cypress Storybook Commands

This package registers a set of cypress commands that will allow you to test components in storybook visually and functionally.

## Usage

In your `cypress/support/commands.js` add the following:

```
import addStoryBookCommands from 'cypress-storybook-commands';

addStoryBookCommands({
  platform: 'web', // set to native if using storybook-native
  viewportPresets: { // see https://docs.cypress.io/api/commands/viewport.html#Arguments
    mobile: 'iphone-6',
    tablet: 'ipad-2',
    laptop: 'macbook-15',
    desktop: [1920, 1080]
  },
  registerSnapshotCommands: true // set to false if you already include cypress-image-snapshot/command in your setup
})

```

Note: update platform accordingly for the type of storybook you are using, default is web.

### Visual regression tests

In your test file e.g. `cypress/tests/components/visual-regression.js` you can simply:

```
context('Components', () => {
  it('render components as expected', () => {
    cy.visit('/')
      .runStorybookVisualRegression();
  });
});
```

### Functional tests

In your test file e.g. `cypress/tests/components/accordion.js` you can load the story to carry out functional testing as follows:

```
context('Components: Accordion', () => {
  beforeEach(() => {
    cy.visit('/')
      .loadStory('Accordion.default')
  });

  it('toggles content as expected', () => {
    cy.get('div[data-testid="tab"]').click()
    ... etc ...
  });
});
```

Note: `Accordion.default` is the testID set in the navigator for that story via the `data-testid` attribute.
