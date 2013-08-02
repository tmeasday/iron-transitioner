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
  _defaultTransitionType: function(from, to) {
    // rendering the initial page? no transition
    if (_.isUndefined(from)) return false;
    
    // just the data context changed? no transition
    if (from.context.path === to.context.path &&
        from.partial.template === to.partial.template)
      return false;
    
    // XXX: if next transition is set, return that
    
    // a standard transition
    return 'normal';
  },
  
  attach: function(template) {
    var oldRender, self = this;
    
    self.container = template.find('.transitioner-panes');
    self.leftPane = template.find('.left-pane');
    self.rightPane = template.find('.right-pane');
    
    Deps.autorun(function() {
      var newRender = {
        partial: self.router._partials.get(),
        context: self.router.current()
      };
      
      var type = self._defaultTransitionType(oldRender, newRender);
      if (self.transitionType)
        type = self.transitionType.call(oldRender, newRender, type)
      
      // save for next time
      oldRender = newRender;
      
      // if type is false, we are explicitly _NOT_ transitioning
      if (type === false) {
        // console.log('changing without transition', oldRender, newRender)
        
        // first time
        if (! self.currentPage) {
          self.currentPage = self.leftPane;
          self.leftIsNext = false;
        }
        
        self.clearPane(self.currentPage);
        self.renderToPane(self.currentPage);
        
      } else {
        // console.log('transitioning', self.leftIsNext, oldRender, newRender)
        self.transitionStart(type);
      }
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
    // console.log('transitionEnd', self.currentPage, self.nextPage);
    
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
    // console.log('clearing pane', pane)
    pane.innerHTML = '';
  },
  
  renderToPane: function(pane) {
    // console.log('rendering to pane', pane)
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