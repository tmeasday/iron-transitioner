Package.describe({
  summary: 'Transitions for the Iron Router'
});

Package.on_use(function (api) {
  api.use(['iron-router', 'templating', 'less'], 'client');
  api.add_files([
      'jquery.easing.1.3.js',

      'easings.less',
      'jquery.mobile.transition.css',
      'jquery.mobile.transition.fade.css',
      'jquery.mobile.transition.flip.css',
      'jquery.mobile.transition.flow.css',
      'jquery.mobile.transition.pop.css',
      'jquery.mobile.transition.slide.css',
      'jquery.mobile.transition.slidedown.css',
      'jquery.mobile.transition.slidefade.css',
      'jquery.mobile.transition.slidein.keyframes.css',
      'jquery.mobile.transition.slideout.keyframes.css',
      'jquery.mobile.transition.slideup.css',
      'jquery.mobile.transition.turn.css',
      'jquery.mobile.transition.visuals.css',

      'transitionerPanes.html',
    'transitionerPanes.js'
  ], 'client')
});

Package.on_test(function(api) {
  api.use([
    'iron-transitioner',
    'tinytest',
    'test-helpers',
    'templating',
  ]);
  
  api.add_files([
      'jquery.easing.1.3.js',

      'easings.less',
      'jquery.mobile.transition.css',
      'jquery.mobile.transition.fade.css',
      'jquery.mobile.transition.flip.css',
      'jquery.mobile.transition.flow.css',
      'jquery.mobile.transition.pop.css',
      'jquery.mobile.transition.slide.css',
      'jquery.mobile.transition.slidedown.css',
      'jquery.mobile.transition.slidefade.css',
      'jquery.mobile.transition.slidein.keyframes.css',
      'jquery.mobile.transition.slideout.keyframes.css',
      'jquery.mobile.transition.slideup.css',
      'jquery.mobile.transition.turn.css',
      'jquery.mobile.transition.visuals.css',

    'transitionerPanes_test.html',
    'transitionerPanes_test.js'
  ], 'client')
});