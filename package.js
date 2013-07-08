Package.describe({
  summary: 'Transitions for the Iron Router'
});

Package.on_use(function (api) {
  api.use(['iron-router', 'templating'], 'client');
  api.add_files([
    'transitionerPanes.html', 
    'transitionerPanes.js'
  ], 'client')
});
