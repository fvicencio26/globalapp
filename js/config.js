/* js/config.js — Phase 1 API/config abstraction (non-destructive)
   Provides a small, safe facade around the existing window.__GLOBALAPP_CONFIG__
   so future code can import a single source-of-truth without changing current pages.
*/
(function (window) {
  'use strict';

  // Read existing injected config (agents console uses window.__GLOBALAPP_CONFIG__)
  var injected = window.__GLOBALAPP_CONFIG__ || {};

  var Config = {
    // Primary webhook (kept for backward compatibility). Use getWebhook() in services.
    WEBHOOK_URL: injected.WEBHOOK_URL || injected.webhookUrl || 'http://localhost:5681/webhook/...',

    // Placeholder for future API endpoints config
    API_ENDPOINTS: injected.API_ENDPOINTS || {
      // e.g. agentsStatus: '/api/agents/status'
    },

    getWebhook: function () { return Config.WEBHOOK_URL; },
    set: function (obj) { Object.assign(Config, obj); }
  };

  // Expose for the rest of the frontend (safe global)
  window.GlobalAppConfig = window.GlobalAppConfig || Config;

})(window);
