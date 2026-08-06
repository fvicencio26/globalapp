/* js/router.js — Phase 1 minimal hash router (non-destructive)
   Simple router to allow future pages to register handlers without interfering with current UI.
   Uses hash-based routing and exposes register/navigate methods.
*/
(function (window) {
  'use strict';

  var routes = {};
  var fallback = null;

  function onHashChange() {
    var hash = (window.location.hash || '#').replace(/^#/, '') || '';
    var route = routes[hash] || fallback;
    if (route && typeof route === 'function') {
      try { route(hash); } catch (e) { console.error('router handler error', e); }
    }
  }

  window.SaaSRouter = window.SaaSRouter || {
    register: function (path, handler) { routes[path] = handler; },
    setFallback: function (handler) { fallback = handler; },
    navigate: function (path) { window.location.hash = path; },
    start: function () { window.addEventListener('hashchange', onHashChange); onHashChange(); }
  };

})(window);
