/* js/app.js — Phase 1 bootstrapping entrypoint (non-destructive)
   This file wires config, store and router lightly. It is intentionally conservative:
   - Does NOT remove or change existing inline scripts
   - Exposes an init() for progressive migration
*/
(function (window, document) {
  'use strict';

  function init() {
    // Ensure config and store exist
    if (!window.GlobalAppConfig) {
      console.warn('GlobalAppConfig not found, creating defaults');
      // require config.js to be loaded before calling init
    }
    if (!window.GlobalAppStore) {
      console.warn('GlobalAppStore not found, creating default');
    }

    // Start router (safe no-op if no routes registered)
    if (window.SaaSRouter && typeof window.SaaSRouter.start === 'function') {
      try { window.SaaSRouter.start(); } catch (e) { console.error(e); }
    }

    // No further intrusive initialization here — migration will progressively attach components.
    console.info('GlobalApp SaaS scaffold initialized (Phase 1)');
  }

  window.GlobalAppSaaS = window.GlobalAppSaaS || { init: init };

})(window, document);
