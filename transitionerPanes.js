// Handlebars.registerHelper('transition', function(options) {
//   var contentFn = options.fn;
//   
//   Session.set('renderToLeft', true);
//   Session.set('renderToRight', false);
//   Session.set('ceal')
//   
//   return '<div class="transition-panes">' +
//     Spark.isolate(function() {
//       if (Session.get('renderToLeft', true))
//         return contentFn();
//       
//       
//     })
//   
//   
// });


ClientRouter.prototype.layout = 'transitionerPanes';

Transitioner = {
  _transitionEvents: 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner',
  
  attach: function(template) {
    var oldContext, self = this;
    
    self.container = template.find('.transitioner-panes');
    self.leftPane = template.find('.left-pane');
    self.rightPane = template.find('.right-pane');
    
    Deps.autorun(function() {
      var newContext = Router.current();
      
      if (! oldContext || oldContext.path !== newContext.path) {
        self.transitionStart();
        oldContext = newContext;
      }
    });
  },
  
  transitionStart: function() {
    console.log('>> Transition happening');
    var self = this;
    
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