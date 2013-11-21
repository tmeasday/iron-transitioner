Package.describe({
  summary: 'Transitions for the Iron Router'
});

Package.on_use(function (api) {
  api.use(['iron-router', 'templating', 'underscore', 'less'], 'client');
  api.add_files([
    'lib/transitioned_default_layout.html',
    'lib/transitioned_default_layout.less',
    'lib/transitioned_yield.html', 
    'lib/transitioned_yield.js',
    'lib/transitioned_page_manager.js'
  ], 'client')
  
  api.export('TransitionedYield', 'client', {testOnly: true});
  api.export('TransitionedPageManager', 'client', {testOnly: true});
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
    'tests/mocks.js',
    'tests/templates.html',
    'tests/transitioned_yield.js',
    'tests/transitioned_page_manager.js'
  ], 'client')
});