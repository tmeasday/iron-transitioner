ClientRouter.prototype.layout = 'transitionerPanes';

Transitioner = {
  // by default, listen to the singleton router, override to not (e.g. tests)
  router: Router,
  _transitionEvents: 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner',
  transitioning: false,
  leftIsNext: true,
  lastType: null,
  
  // we are transitioning from -> to.
  //   what template should we use?
  //   return false to not transition at all (directly render into currentPage)
  transitionType: function(from, to) {
    // by default, no transition the first time, otherwise normal
    return (! _.isUndefined(from)) && 'normal';
  },
  
  attach: function(template) {
    var oldPartial, oldContext, self = this;
    
    self.container = template.find('.transitioner-panes');
    self.leftPane = template.find('.left-pane');
    self.rightPane = template.find('.right-pane');
    
    Deps.autorun(function() {
      var newPartial = self.router._partials.get();
      var newContext = self.router.current();
      var transitioned = false;
      
      newContext && console.log(newContext.path)
      if (! oldPartial || ! oldContext || newContext.path !== oldContext.path 
          || newPartial.template !== oldPartial.template) {
        
        // XXX: I want to pass the partial in here too...
        var type = self.transitionType(oldContext, newContext);
        
        if (type !== false) {
          console.log('transitioning', self.leftIsNext, oldContext, newContext)
          self.transitionStart(type);
          transitioned = true;
        }
      }
      
      if (! transitioned) {
        console.log('changing without transition', oldContext, newContext)
        
        // first time
        if (! self.currentPage) {
          self.currentPage = self.leftPane;
          self.leftIsNext = false;
        }
        
        self.clearPane(self.currentPage);
        self.renderToPane(self.currentPage);
      }
      
      oldPartial = newPartial;
      oldContext = newContext;
    });
  },
  
  transitionStart: function(type) {
    var self = this;
    
    // kill exisiting transition
    self.transitioning && self.transitionEnd();
    self.transitioning = true;
    
    self.renderToNextPane(self.leftIsNext ? self.leftPane : self.rightPane);
    self.leftIsNext = ! self.leftIsNext;
    
    self.container.offsetWidth; // force a redraw
    
    self.lastType = type || 'normal';
    $(self.container).addClass('transitioning ' + self.lastType)
      .on(self._transitionEvents, function(e) {
        if (! $(e.target).is(self.container))
          return;
        
        self.transitionEnd();
      });
  },
  
  transitionEnd: function() {
    var self = this;
    console.log('transitionEnd', self.currentPage, self.nextPage);
    
    // switch classes around
    if (self.currentPage) {
      $(self.currentPage).removeClass('current-page');
      
      self.clearPane(self.currentPage);
    }
    
    self.currentPage = self.nextPage;
    $(self.currentPage).removeClass('next-page').addClass('current-page');
    
    // finish.
    $(self.container).removeClass('transitioning ' + self.lastType)
      .off(self._transitionEvents);
    
    self.transitioning = false;
  },
  
  clearPane: function(pane) {
    // XXX: remove this properly, making sure bindings work correctly
    console.log('clearing pane', pane)
    pane.innerHTML = '';
  },
  
  renderToPane: function(pane) {
    console.log('rendering to pane', pane)
    var self = this;
    
    pane.appendChild(Meteor.render(function() {
      // render the current page to the current pane
      return self.router._partials.get().render();
    }));
  },
  
  renderToNextPane: function(pane) {
    this.renderToPane(pane);
    this.nextPage = pane;
    $(pane).addClass('next-page');
  }
}

Template.transitionerPanes.rendered = function() {
  if (! this.attached) {
    this.attached = true;
    Transitioner.attach(this);
  }
}