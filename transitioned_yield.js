Template.transitionerPanes.rendered = function() {
  console.log('transitionerPanes rendered');
  this.data.transitionedYield.setPanesTemplate(this);
}

TransitionedYield = function(pageManager, key) {
  // we use these to render
  this.pageManager = pageManager;
  this.key = key;
  this.dependency = new Deps.Dependency;
  
  // this gets set by the rendered function above
  this.panesTemplate = null;
  
  // null means that we haven't yet started XXX: ??
  this.type = false;
  this.leftIsNext = null;
}

_.extend(TransitionedYield.prototype, {
  setPanesTemplate: function(template) {
    if (this.panesTemplate)
      return;
    
    this.panesTemplate = template;
    
    this.container = template.find('.transitioner-panes');
    this.leftPane = template.find('.left-pane');
    this.rightPane = template.find('.right-pane');
    
    // now we have the panes, lets we can start drawing to them
    this.startComputation();
  },
  
  // transition now
  //
  // XXX: how to pass in template names?
  transition: function(templateName, type) {
    console.log('transitioning')
    // set the template somewhere
    this.type = type;
    
    // first up, we need to make sure the old pane pauses rendering
    this.stopPaneRendering(this.leftIsNext ? this.rightPane : this.leftPane);
    
    // ok, we have a transition type, so we re-run the rendering computation 
    this.dependency.changed();
  },
  
  render: function() {
    console.log('rendering')
    // 1. need some way to get the template instance
    
    // set up the autorun
    // this.start();
    
    var data = {transitionedYield: this};
    
    // XXX rename this template
    return Template.transitionerPanes(data);
  },
  
  // set up the autorun that will re-run every time we need to redraw
  startComputation: function() {
    var self = this;
    
    Deps.autorun(function() {
      self.dependency.depend();
      
      // console.log(oldRender && oldRender.controller.path, 
      //   oldRender && oldRender.template,
      //   newRender.controller.path, 
      //   newRender.template, 
      //   type);
      
      console.log('in computation', self.type);
      
      // if type is false, this must be the first time
      if (self.type === false) {
        // console.log('setting up transition', oldRender, newRender)
        
        self.makeCurrentPage(self.leftPane);
        self.leftIsNext = false;
        self.renderToPane(self.currentPage);
        
      } else {
        // console.log('transitioning', self.leftIsNext, oldRender, newRender)
        // self.transitionStart(type, oldRender, newRender);
        self.transitionStart(self.type);
      }
      
      // return done();
    });
  },
  
  transitionStart: function(type, from, to) {
    var self = this;
    
    // kill exisiting transition
    self.transitioning && self.transitionEnd();
    self.transitioning = true;
    
    self.renderToNextPane(self.leftIsNext ? self.leftPane : self.rightPane);
    self.leftIsNext = ! self.leftIsNext;
    
    var classes = type;
    // XXX
    // if (_.isString(from.template))
    //   classes = classes + ' from-' + from.template;
    // if (_.isString(to.template))
    //   classes = classes + ' to-' + to.template;
    $(self.container).addClass(self.lastTransitionClasses = classes)
    
    self.container.offsetWidth; // force a redraw
    
    // XXX: build in a timeout
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
  
  // ******* The stuff that actually deals with the panes ********* //
  stopPaneRendering: function(pane) {
    // XXX: should we stop a computation here?
    // console.log('finalizing pane', pane);
    Spark.finalize(pane);
  },
  
  clearPane: function(pane) {
    // console.log('clearing pane', pane)
    pane.innerHTML = '';
  },
  
  renderToPane: function(pane) {
    console.log('rendering to pane', pane)
    var self = this;
    
    // This is an isolate block
    pane.appendChild(Meteor.render(function() {
      console.log('in the spark.render block')
      // render the current page to the current pane
      var html = self.pageManager._renderTemplate(self.key);
      console.log(html);
      return html
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
  
});

