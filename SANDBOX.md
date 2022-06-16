## Stroybook Web

Boot up the web storybook with `yarn storybook` and point the baseUrl in `sandbox/cypress/package.json` to `http://localhost:6006/` (or whatever url it gives you)

### For version 5

Just point baseUrl to something like `https://lonelyplanet.github.io/backpack-ui/`

## Storybook Native

Boot up the native storybook with `yarn storybook-native` and point the baseUrl in `sandbox/cypress/package.json` to `http://localhost:19006`

## Cypress

With storybook running, and the cypress config updated with the right base url you can launch cypress with `yarn cypress`.

You now have a sandbox for testing the `cypress-storybook-commands` package found in the `packages` folder.

# Publishing

Login to npm with `npm login` and you can then `npm publish` with yarn workspace or within the package directory.