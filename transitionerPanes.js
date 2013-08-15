ClientRouter.prototype.layout = 'transitionerPanes';

Transitioner = {
  // by default, listen to the singleton router, override to not (e.g. tests)
  router: Router,
  _transitionEvents: 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner',
  lastTransitionClasses: null,
  transitioning: false,
  leftIsNext: true,
  _nextTransitionType: null,
  
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
    
    // did we set a next transition?
    if (this._nextTransitionType !== null)
      return this._nextTransitionType;
    
    // a standard transition
    return 'normal';
  },
  
  attach: function(template) {
    var self = this, oldRender, newRender, type;
    var dependency = new Deps.Dependency;
    
    self.container = template.find('.transitioner-panes');
    self.leftPane = template.find('.left-pane');
    self.rightPane = template.find('.right-pane');
    
    // the first auto run talks to the router and .change()s the dependency
    // when ever a transition is necessary. In the process it stores
    // oldRender, newRender and type.
    Deps.autorun(function() {
      newRender = {
        partial: self.router._partials.get(),
        // XXX: shouldn't need to do this, the router is doing something funny
        context: Deps.nonreactive(function() { return self.router.current(); })
      };
      
      var done = function() {
        // save for next time
        oldRender = newRender;
        self._nextTransitionType = null;
      }
      
      type = self._defaultTransitionType(oldRender, newRender);
      if (self.transitionType)
        type = self.transitionType(oldRender, newRender, type)
      
      // console.log('new render', oldRender, newRender, type)
      
      // if type is false, we are explicitly _NOT_ transitioning
      // so do nothing.
      if (type === false)
        return done();
      
      // ok, we have a transition type, so we re-run the rendering computation 
      dependency.changed();
      
      Deps.afterFlush(done);
    });
    
    Deps.autorun(function() {
      dependency.depend();
      
      // console.log(oldRender && oldRender.context.path, 
      //   oldRender && oldRender.partial.template,
      //   newRender.context.path, 
      //   newRender.partial.template, 
      //   type);
      
      // if type is false, this must be the first time
      if (type === false) {
        // console.log('setting up transition', oldRender, newRender)
        
        self.makeCurrentPage(self.leftPane);
        self.leftIsNext = false;
        self.renderToPane(self.currentPage);
        
      } else {
        // console.log('transitioning', self.leftIsNext, oldRender, newRender)
        self.transitionStart(type, oldRender, newRender);
      }
    });
  },
  
  setNextTransitionType: function(type) {
    this._nextTransitionType = type;
  },
  
  back: function() {
    this.setNextTransitionType('back');
    Location.back()
  },
  
  transitionStart: function(type, from, to) {
    var self = this;
    
    // kill exisiting transition
    self.transitioning && self.transitionEnd();
    self.transitioning = true;
    
    self.renderToNextPane(self.leftIsNext ? self.leftPane : self.rightPane);
    self.leftIsNext = ! self.leftIsNext;
    
    var classes = type;
    if (_.isString(from.partial.template))
      classes = classes + ' from-' + from.partial.template;
    if (_.isString(to.partial.template))
      classes = classes + ' to-' + to.partial.template;
    $(self.container).addClass(self.lastTransitionClasses = classes)
    
    self.container.offsetWidth; // force a redraw
    
    $(self.container).addClass('transitioning')
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
    self.makeCurrentPage(self.nextPage);
    
    // finish.
    $(self.container).removeClass('transitioning ' + self.lastTransitionClasses)
      .off(self._transitionEvents);
    
    self.transitioning = false;
  },
  
  clearPane: function(pane) {
    // console.log('clearing pane', pane)
    Spark.finalize(pane);
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
    this.makeNextPage(pane);
  },
  
  makeCurrentPage: function(pane) {
    this.currentPage = pane;
    $(pane).removeClass('next-page').addClass('current-page');
  },
  
  makeNextPage: function(pane) {
    this.nextPage = pane;
    $(pane).removeClass('current-page').addClass('next-page');
  }
}

Template.transitionerPanes.rendered = function() {
  if (! this.attached) {
    this.attached = true;
    Transitioner.attach(this);
  }
}