var _transitionEvents = 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner';

TransitionedRouter = Utils.extend(ClientRouter, {
  constructor = function(options) {
    TransitionedRouter.__super__.constructor.apply(this, arguments);
    
    this.transitioning = false;
    this._lastTransitionClasses = null;
    this._nextTransitionType = null;
    
    // first and second refer to literal order in the DOM
    this._firstLayoutController = new LayoutController;
    this._secondLayoutController = new LayoutController;
    
    // we render into the first one first so next
    this._currentLayoutController = this._secondLayoutController;
    this._nextLayoutController = this._firstLayoutController;
  }
  
  _defaultTransitionType: function(oldTemplate, newTemplate) {
    if (! oldTemplate)
      return false;
    
    // did we set a next transition?
    if (this._nextTransitionType !== null)
      return this._nextTransitionType;
    
    return 'normal';
  },
  
  setLayout: function(layout) {
    // if the layout changes, we definitely want to transition, but __main__
    // will catch it.. wont it?
    
    // XXX: what about the first time?
    // XXX: what about type?
    this._currentLayoutController.setLayout(layout);
  },
  
  setTemplate: function(template, to) {
    to = to || '__main__';
    
    // XXX: not completely sure what the correct logic is here, work through
    if (to === '__main__') {
      var old = this._currentLayoutController.templates.get(to);
      
      var type = self._defaultTransitionType(old, template);
      if (self.transitionType)
        type = self.transitionType(oldRender, newRender, type)
      
      type && this._startTransition(type);
    }
    
    this._currentLayoutController.setTemplate(template, to);
  },
  
  render: function() {
    this.isRendered = true;
    
    // XXX: need some way to get references to these <div>s
    var html = '<div class="transitioner-panes">';
    html += '<div class="first-pane">' + 
      this._firstLayoutController.renderLayout() + '</div>';
    html += '<div class="second-pane">' + 
      this._secondLayoutController.renderLayout() + '</div>';
    return html + '</div>'
  },
  
  _transitionStart: function() {
    var self = this;
    
    // kill exisiting transition
    self.transitioning && self._transitionEnd();
    self.transitioning = true;
    
    var classes = type,
      from = this._currentLayoutController.templates.__main__,
      to = this._nextLayoutController.templates.__main__;
    
    _.isString(from) && classes +=' from-' + from;
    _.isString(to) && classes +=' to-' + to;
    
    // XXX: need to get a reference to self.container
    $(self.container).addClass(self._lastTransitionClasses = classes)
    self.container.offsetWidth; // force a redraw
    
    $(self.container).addClass('transitioning')
      .on(_transitionEvents, function(e) {
        if (! $(e.target).is(self.container))
          return;
        
        self._transitionEnd();
      });
    
    // now switch next + current, ready to draw whatever just changed.
    var temp = self._currentLayoutController;
    self._currentLayoutController = self._nextLayoutController;
    self._nextLayoutController = temp;
  },
  
  _transitionEnd: function() {
    var self = this;
    
    // XXX: need references to currentPane + nextPane
    // switch classes around
    self._currentLayoutController.pane.removeClass('next-page').addClass('current-page');
    // XXX: need to be able to clear layout controllers.
    self._nextLayoutController.clear();
    self._nextLayoutController.pane.removeClass('current-page').addClass('next-page');
    
    // finish.
    $(self.container).removeClass('transitioning ' + self.lastTransitionClasses)
      .off(_transitionEvents);
    
    self.transitioning = false;
  }
});


// kill the current Router singleton and replace with our own
Router.configure({
  autoStart: false,
  autoRun: false
});

Router = new TransitionedRouter;