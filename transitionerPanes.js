Transitioner = {
  _transitionEvents: 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner',
  
  attach: function(template) {
    var oldContext, self = this;
    
    self.container = template.find('.transitioner-panes');
    self.leftPane = template.find('.left-pane');
    self.rightPane = template.find('.right-pane');
    
    Deps.autorun(function() {
      var newContext = Router.current();
      
      console.log(newContext);
      if (! oldContext || oldContext.path !== newContext.path) {
        self.transitionStart(newContext);
        oldContext = newContext;
      }
    });
  },
  
  transitionStart: function(context) {
    var self = this;
    
    if (! self.reverse) {
      self.renderTo(context, self.leftPane);
      self.reverse = true;
    } else {
      self.renderTo(context, self.rightPane);
      self.reverse = false;
    }
    
    // force a redraw
    $(self.container).offset();
    
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
  },
  
  renderTo: function(context, pane) {
    pane.appendChild(Meteor.render(_.bind(context.result, context)));
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