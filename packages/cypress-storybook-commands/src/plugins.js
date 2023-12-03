module.exports.addCrossBrowserVisualDiscrepanciesPlugin = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    // https://github.com/cypress-io/cypress/issues/5240
    const args = Array.isArray(launchOptions) ? launchOptions : launchOptions.args;

    if (browser.name === 'chrome' || browser.name === 'chromium') {
      // In headless mode, Cypress fixes the scale factor to 1, and this forces
      // screenshots to be taken with an image size matching the viewport size
      // instead of the viewport size multiplied by the scale factor.
      //
      // Since we also want to run the image regression tests in development mode,
      // we need to set the device scale factor to 1 in chrome / chromium.
      //
      // See: https://github.com/cypress-io/cypress/issues/2102#issuecomment-521299946
      // See: https://github.com/cypress-io/cypress/blame/a7dfda986531f9176468de4156e3f1215869c342/packages/server/lib/cypress.coffee#L132-L137
      args.push('--force-device-scale-factor=1');

      // Force the colour profile - should reduce colour differences in diffs between MacOS and Linux (CI)
      args.push('--force-color-profile=srgb');

      // Force font rendering - should reduce differences in diffs between MacOS and Linux (CI)
      args.push('--font-render-hinting=none');

      // Force overlay scrollbars - more consistent between mac and linux
      args.push('--enable-features=OverlayScrollbar');

      // helps with flaky animations
      args.push('--force-prefers-reduced-motion');
    }

    return launchOptions;
  });
};
