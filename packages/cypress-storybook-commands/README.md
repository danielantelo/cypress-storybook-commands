# Cypress Storybook Commands

This package registers a set of cypress commands that will allow you to test components in storybook visually and functionally.

Now supports projects using cypress 10 and Storybook 6.

## Installation

```
yarn add cypress-storybook-commands --dev
```

or

```
npm i cypress-storybook-commands --dev
```

### Setup

You must include the `@simonsmith/cypress-image-snapshot` plugin in `cypress/plugins/index.js` (create the folder and file if not there)

```js
const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
};
```

and ensure that your root `cypress.config.js` is configured to load the plugins

```js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
  },
});
```

#### Add the commands

In your `cypress/support/commands.js` add the following:

```js
import addStoryBookCommands from 'cypress-storybook-commands';

addStoryBookCommands({
  version: 6, // currently compatible with version 5, 6 and 7 of storybook
  viewportPresets: {
    // see https://docs.cypress.io/api/commands/viewport.html#Arguments
    mobile: 'iphone-x',
    tablet: 'ipad-2',
    laptop: 'macbook-13',
    desktop: [1920, 1080],
  },
  registerSnapshotCommands: true, // false if you already include cypress-image-snapshot/command
  preSnapshotFunc: () => {
    console.log('code before snapshot: hide elements, etc');
  },
  postSnapshotFunc: () => {
    console.log('code after snapshot: reset elements, etc');
  },
  snapshotSelector: '#storybook-root', // selector of element to use for snapshots, depends on version of sb
});
```

If you need to tweak the image diff output folder or the threshold for failurers, set `registerSnapshotCommands: false` and also add the below in the same file:

```js
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/plugin/command';

addMatchImageSnapshotCommand({
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  customDiffConfig: { threshold: 0.1 },
  customDiffDir: 'cypress/__visual_diff_errors__',
  allowSizeMismatch: true,
});
```

#### Add the run scripts

In your `cypress/package.json` add a new script for storybook tests:

```
  "scripts": {
    ...
    "cy:storybook": "cypress open --e2e --config baseUrl=http://localhost:9002/,specPattern='cypress/storybook/*'",
    "cy:storybook:headless": "cypress run --e2e --browser chrome --headless --config baseUrl=http://localhost:9002/,specPattern='cypress/storybook/*'"
  }
```

Note we will put storybook tests in their own folder so they do not run with the rest of your `e2e` tests, and we specify the baseUrl of where your storybook can be found.

## Usage

### Visual regression tests

In your test file e.g. `cypress/storybook/visual-regression.cy.js` you can simply:

```js
context('Storybook', () => {
  it('render components as expected', () => {
    cy.visit('/').runStorybookVisualRegression({ storiesToSkip: [] });
  });
});
```

this will iterate over all the stories and capture visual snapshots.

Note: `runStorybookVisualRegression` has optional settings `storiesToSkip`, `storyWaits` and `storyActions`. You can use full story ids or story prefixes e.g. `accordion--primary` or `accordion--`

```js
cy.visit('/')
  .runStorybookVisualRegression({
    // array of story ids or prefixes (found in url of story or the data-item-id in the nav)
    storiesToSkip: ['button-disabled'],
    // map of story matches to wait times in ms before screenshot (e.g. avoid capturing snapshots mid animation, etc));
    storyWaits: {'chart--': 1000}
    // map of story matches to actions to execute before screenshot
    storyActions: {
        'core-dialog': () => cy.contains('Open dialog').click(),
        'core-modal': () => cy.contains('Open Modal').click(),
      },
  });
```

It now also has a viewports option, that allow you to capture different viewports per test:

```js
context("Storybook", () => {
  it("renders primitives and shared components as expected", () => {
    cy.visit("/").runStorybookVisualRegression({
      storiesToSkip: ["pages-", "spinner", "loading"],
      viewports: {
        component: "macbook-13", // don't need to test mobile or tablet for components
      },
    });
  });

  it("renders page as expected", () => {
    cy.visit("/").runStorybookVisualRegression({
      storiesToSkip: ["components-", "primitives-", "loading"],
      viewports: {
        // see https://docs.cypress.io/api/commands/viewport.html#Arguments
        mobile: "iphone-5",
        tablet: "ipad-2",
        laptop: "macbook-15",
      },
    });
  });
});


```

### Functional tests

In your test file e.g. `cypress/storybook/accordion.cy.js` you can load the story to carry out functional testing as follows:

```js
context('Storybook: Accordion', () => {
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

### Running

Ensure storybook is available on a url (should match baseUrl in the above added scripts). Then run `yarn run cy:storybook` or `yarn run cy:storybook:headless` as preferred.

On CI if you build your storybook you can use `npx serve` to serve the distribution files generated by storybook, alternatively just run the storybook app in the background. You will then want to use `npx start-server-and-test` to wait for storybook to be ready before running the cypress headless command.

```
APPCMD="yarn storybook"
CYPRESSCMD="yarn cy:storybook:headless --env requireSnapshots=true"
npx start-server-and-test "$APPCMD" 9002 "$CYPRESSCMD"
```

Note the use of `--env requireSnapshots=true` so that any missing snapshots in the branch cause a CI fail.

#### Parallelism

If you are using storybook 6+ we can make use of the `/stories.json` endpoint to get and split all the stories in the storybook instance.

This means you can pass a comma separated list of stories to include in the parallel instance (injected via the environment):

```js
context('Storybook', () => {
  it('render components as expected', () => {
    cy.visit('/').runStorybookVisualRegression({
      storyList: Cypress.env('storyList') || null,
      storiesToSkip: [],
    });
  });
});
```

Your CI to run different set of stories in parallel could look something like:

```yml
visual-regression-storybook:
  docker:
    - image: cypress/included:10.7.0
  parallelism: 3
  steps:
    - attach_workspace:
        at: .
    - run:
        name: Run Cypress on Storybook
        command: |
          FULLSTORYLIST=$(node -e "console.log(Object.keys(require('./devtools/storybook/dist/stories.json').stories).join('\n'))")
          TESTS=$(echo $FULLSTORYLIST | circleci tests split)
          APPCMD="npx serve@13 --listen 9002 ./devtools/storybook/dist"
          CYPRESSCMD="CYPRESS_storyList='${TESTS// /,}' yarn cy:storybook:headless --env requireSnapshots=true"
          npx start-server-and-test "$APPCMD" 9002 "$CYPRESSCMD"
    - store_artifacts:
        path: devtools/cypress/cypress/snapshots
        destination: snapshots
    - store_artifacts:
        path: stories.json
        destination: stories.json
```

#### Advance usage

Composition and splitting of stories in cy tests). You can get and filter stories as follows:

```js
const storiesWithLoopingAnimations = ['loading', 'zerostate'];

const storyList = (stories, filter) => stories.filter(filter).join(',');

it('renders forms as expected', () => {
  cy.getStories().then((stories) => {
    cy.runStorybookVisualRegression({
      storyList: storyList(stories, (storyId) => storyId.includes('forms-')),
      storiesToSkip: [...storiesWithLoopingAnimations, 'forms-somestory-to-skip'],
    });
  });
});
```

## Minimising Cross OS visual differences

If you are running the snapshots locally on a different OS to what you run on CI, you can minimise visual differences with the following in `cypress/plugins/index.js`

```js
const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot/plugin');
const { addCrossBrowserVisualDiscrepanciesPlugin } = require('cypress-storybook-commands/src/plugins');

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
  // plugin to minimise visual differences between browsers and devices
  addCrossBrowserVisualDiscrepanciesPlugin(on, config);
};
```

## If you are getting Observer errors

Some instances of storybook are throwing some console errors that are stopping cypress from running, you can override that by adding the below into `support/commands.js` or `support/e2e.js`:

```js
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
```
