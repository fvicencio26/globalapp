/* js/store.js — Phase 1 lightweight store (non-destructive)
   A tiny observable store following the structure in ARQUITECTURA.md.
   Designed to coexist with current inline state and to be safe to import progressively.
*/
(function (window) {
  'use strict';

  function createStore(initial) {
    var state = initial || {};
    var listeners = [];

    return {
      get: function (path) {
        if (!path) return state;
        return path.split('.').reduce(function (s, key) { return s && s[key]; }, state);
      },
      set: function (path, value) {
        if (!path) return;
        var keys = path.split('.');
        var target = state;
        for (var i = 0; i < keys.length - 1; i++) {
          var k = keys[i];
          if (typeof target[k] === 'undefined') target[k] = {};
          target = target[k];
        }
        target[keys[keys.length - 1]] = value;
        listeners.forEach(function (l) { try { l(state); } catch(e){} });
      },
      subscribe: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f){return f!==fn}); }; },
      replace: function (next) { state = next; listeners.forEach(function (l){try{l(state);}catch(e){}}); }
    };
  }

  var initialState = {
    user: { role: 'user', name: '', authenticated: false },
    system: { agents: [], workflows: 0, status: 'online' },
    currentPage: 'dashboard',
    queries: { recent: [], saved: [] },
    ui: { theme: 'dark', sidebarOpen: true, mapZoom: 6 }
  };

  window.GlobalAppStore = window.GlobalAppStore || createStore(initialState);

})(window);
