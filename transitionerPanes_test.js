// Kill the built in router
Router.configure({
  autoRender: false,
  autoStart: false
});


Template.one.oneSession = function() { return Session.get('oneSession'); }
Template.two.twoSession = function() { return Session.get('twoSession'); }

Tinytest.add('TransitionerPanes - always re-renders', function(test) {
  var router = new ClientRouter({
    autoRender: false,
    autoStart: true,
    layout: 'transitionerPanes'
  });
  Transitioner.router = router;
  
  router.map(function () {
    this.route('one', {
      path: '/',
      data: function() { return Session.get('oneRoute'); }
    });

    this.route('two', {
      data: function() { return Session.get('twoRoute'); }
    });
  });
  
  Session.set('oneRoute', 'off');
  Session.set('oneSession', 'off');
  Session.set('twoRoute', 'off');
  Session.set('twoSession', 'off');
  router.start();
  router.go('one');
  var renderedPanes = new OnscreenDiv(Spark.render(_.bind(router.render, router)));
  
  Deps.flush()
  test.equal(renderedPanes.text().trim(), 'one off off');
  
  Session.set('oneRoute', 'on');
  Deps.flush()
  test.equal(renderedPanes.text().trim(), 'one on off');
  
  Session.set('oneSession', 'on');
  Deps.flush()
  test.equal(renderedPanes.text().trim(), 'one on on');
  
  router.go('two');
  Deps.flush()
  Transitioner.transitionEnd(); // simulate the end of the animation
  test.equal(renderedPanes.text().trim(), 'two off off');
  
  Session.set('twoRoute', 'on');
  Deps.flush()
  test.equal(renderedPanes.text().trim(), 'two on off');
  
  Session.set('twoSession', 'on');
  Deps.flush()
  test.equal(renderedPanes.text().trim(), 'two on on');
}); 


Tinytest.add('TransitionerPanes - transitionType is respected', function(test) {
  var router = new ClientRouter({
    autoRender: false,
    autoStart: true,
    layout: 'transitionerPanes'
  });
  Transitioner.router = router;
  
  router.map(function () {
    this.route('one', {
      path: '/'
    });

    this.route('two');
  });
  
  router.start();
  router.go('one');
  var renderedPanes = new OnscreenDiv(Spark.render(_.bind(router.render, router)));
  
  Deps.flush()
  test.isFalse($(renderedPanes.div).find('.transitioner-panes').hasClass('transitioning'));
  
  router.go('two')
  Deps.flush()
  test.isTrue($(renderedPanes.div).find('.transitioner-panes').hasClass('transitioning'));
  Transitioner.transitionEnd(); // simulate the end of the animation
  
  Transitioner.transitionType = function() { return false; }
  
  router.go('one');
  Deps.flush()
  test.isFalse($(renderedPanes.div).find('.transitioner-panes').hasClass('transitioning'));
  
  router.go('two')
  Deps.flush()
  test.isFalse($(renderedPanes.div).find('.transitioner-panes').hasClass('transitioning'));
  
  Transitioner.transitionType = function() { return 'special'; }
  router.go('one');
  Deps.flush()
  test.isTrue($(renderedPanes.div).find('.transitioner-panes').hasClass('transitioning'));
  test.isTrue($(renderedPanes.div).find('.transitioner-panes').hasClass('special'));
});
