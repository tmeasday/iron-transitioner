Package.describe({
  summary: 'Transitions for the Iron Router'
});

Package.on_use(function (api) {
  api.use(['iron-router', 'templating'], 'client');
  api.add_files([
    'transitionerPanes.html', 
    'transitionerPanes.js'
  ], 'client');
  
  if (! _.isUndefined(api.export)) {
    api.export('Transitioner', 'client');
  }
});

Package.on_test(function(api) {
  api.use([
    'iron-transitioner',
    'tinytest',
    'test-helpers',
    'templating',
  ]);
  
  api.add_files([
    'transitionerPanes_test.html',
    'transitionerPanes_test.js'
  ], 'client')
});