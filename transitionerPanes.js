ClientRouter.prototype.layout = 'transitionerPanes';

Transitioner = {
  _transitionEvents: 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner',
  transitioning: false,
  
  attach: function(template) {
    var oldPartial, oldPath, self = this;
    
    self.container = template.find('.transitioner-panes');
    self.leftPane = template.find('.left-pane');
    self.rightPane = template.find('.right-pane');
    
    Deps.autorun(function() {
      var newPartial = Router._partials.get();
      var newPath = Router.current().path;
      
      if (! oldPartial || oldPath !== newPath || newPartial.template != oldPartial.template) {
        self.transitionStart();
        oldPartial = newPartial;
        oldPath = newPath;
      }
    });
  },
  
  transitionStart: function() {
    var self = this;
    
    // kill exisiting transition
    self.transitioning && self.transitionEnd();
    self.transitioning = true;
    
    if (! self.reverse) {
      self.renderTo(self.leftPane);
      self.reverse = true;
    } else {
      self.renderTo(self.rightPane);
      self.reverse = false;
    }
    
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
    
    // switch classes around
    if (self.currentPage) {
      $(self.currentPage).removeClass('current-page');
      
      // XXX: remove this properly, making sure bindings work correctly
      self.currentPage.innerHTML = '';
    }
    
    self.currentPage = self.nextPage;
    $(self.currentPage).removeClass('next-page').addClass('current-page');
    
    // finish.
    $(self.container).removeClass('transitioning')
      .off(self._transitionEvents);
    
    self.transitioning = false;
  },
  
  renderTo: function(pane) {
    pane.appendChild(Meteor.render(function() {
      // render the current page to the current pane
      return Router._partials.get().render();
    }));
    
    this.nextPage = pane;
    $(pane).addClass('next-page');
  }
}

Template.transitionerPanes.rendered = function() {
  if (! this.attached) {
    Transitioner.attach(this);
    this.attached = true;
  }
}