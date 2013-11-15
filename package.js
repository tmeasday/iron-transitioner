Package.describe({
  summary: 'Transitions for the Iron Router'
});

Package.on_use(function (api) {
  api.use(['iron-router', 'templating'], 'client');
  api.add_files([
    // 'transitioned_default_layout.html',
    // 'transitioning_page_manager.js',
    // XXX: remove this
    'transitionerPanes.html', 
    'transitioned_yield.js'
  ], 'client')
  
  api.export('TransitionedYield', 'client', {testOnly: true});
});

Package.on_test(function(api) {
  api.use([
    'iron-router',
    'iron-transitioner',
    'tinytest',
    'test-helpers',
    'templating',
  ]);
  
  api.add_files([
    'tests/templates.html',
    'tests/transitioned_yield.js'
  ], 'client')
});