# Cypress Storybook Commands

This package registers a set of cypress commands that will allow you to test components in storybook visually and functionally.

## Usage

In your `cypress/support/commands.js` add the following:

```
import addStoryBookCommands from 'cypress-storybook-commands';

addStoryBookCommands({
  version: 5, // currently only Storybook 5 is supported
  platform: 'web', // set to native if using storybook-native
  viewportPresets: { // see https://docs.cypress.io/api/commands/viewport.html#Arguments
    mobile: 'iphone-6',
    tablet: 'ipad-2',
    laptop: 'macbook-13',
    desktop: [1920, 1080],
  },
  registerSnapshotCommands: true // false if you already include cypress-image-snapshot/command
  preSnapshotFunc: () => { console.log('code before snapshot: hide elements, etc' )},
  postSnapshotFunc: () => { console.log('code after snapshot: reset elements, etc' )},
})

```

Note: update platform accordingly for the type of storybook you are using, default is web.

### Pre-requisites

You must include the `cypress-image-snapshot` plugin in `cypress/plugins/index.js`

```
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin')

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config)
}
```

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

### Tags

You can add certain # tags to story names to carry out certain actions:

- `#vrs`: Visual Regression Skip, skip this story from visual regression tests. Useful for those story entries that may have animations or videos that can cause flaky automated visual tests.

- `#vrw2`: Visual Regression Wait, add a wait after story loads. Useful for those story entries that have animations on load. The number after the vrw is the number of seconds to wait. 

```
storiesOf('MyComponent', module)
  .add('default', () => <MyComponent />)
  .add('video #vrs', () => <MyComponent video  />)
  .add('video #vrw1', () => <MyComponent animated  />)
```
