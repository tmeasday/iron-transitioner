var MAIN_YIELD = '__main__';
var DEFAULT_LAYOUT = '__transitionedDefaultLayout__'

TransitioningPageManager = Utils.extend(PageManager, {
  constructor: function (options) {
    var self = this;

    TransitioningPageManager.__super__.constructor.apply(this, arguments);
    
    // override the default layout
    this.layout.set(DEFAULT_LAYOUT);
  },
  
  setTemplate: function (template, to) {
    console.log('setTemplate', template, to)
    return TransitioningPageManager.__super__.setTemplate.apply(this, arguments);
    
    
    
    // this is the new logic:
    
    // 1. work out the new render: 
    
    // console.log('in the onSetTemplate', render);
    newRender = render;
    
    // 2. work out the transition type: (should this be called on the router?)
    type = self._defaultTransitionType(oldRender, newRender);
    if (self.transitionType)
      type = self.transitionType(oldRender, newRender, type)
  
    // console.log('new render', oldRender, newRender, type)
  
    // XXX: potentially everything above here should be done in the router itself?
    
    var template = self.transitionedTemplates[to];
    
    if (! template) {
      // do the default, pass through to yeild
      return TransitioningPageManager.__super__.setTemplate.apply(this, arguments);
    } else {
      template.setTemplate(render.template, type);
    }
  },
  
  helpers: function () {
    var self = this;
    return _.extend(TransitioningPageManager.__super__.helpers.apply(this, arguments), {
      // exactly the same as yield for now
      'transitionedYield': function(key, options) {
        var html;

        if (arguments.length < 2)
          key = null;

        html = self._renderTransitionedTemplate(key);
        return new Handlebars.SafeString(html);
      }
    });
  },
  
  _renderTransitionedTemplate: function (key) {
    var key = key || MAIN_YIELD;
    console.log('rendering template ' + key);
    
    var data = {
      
    }
    
    
  },
  
  renderLayout: function () {
    console.log('rendering layout ' + this.layout.get())
    return TransitioningPageManager.__super__.renderLayout.apply(this, arguments);
  }
});


// override the page manager
// XXX: instead, probably override the whole router so we can redefine
Router._page = new TransitioningPageManager;

// Router.prototype.back
// Router.prototype.setNextTransitionType
// Router.prototype.transitionType

// set a flag when the route changes?