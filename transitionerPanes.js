






// Transitioner = {
//   // by default, listen to the singleton router, override to not (e.g. tests)
//   router: Router,
//   _transitionEvents: 'webkitTransitionEnd.transitioner oTransitionEnd.transitioner transitionEnd.transitioner msTransitionEnd.transitioner transitionend.transitioner',
//   lastTransitionClasses: null,
//   transitioning: false,
//   leftIsNext: true,
//   _nextTransitionType: null,
//   
//   // we are transitioning from -> to.
//   //   what template should we use?
//   //   return false to not transition at all (directly render into currentPage)
//   _defaultTransitionType: function(from, to) {
//     // rendering the initial page? no transition
//     if (_.isUndefined(from)) return false;
//     
//     // just the data context changed? no transition
//     if (from.controller.path === to.controller.path &&
//         from.template === to.template)
//       return false;
//     
//     // did we set a next transition?
//     if (this._nextTransitionType !== null)
//       return this._nextTransitionType;
//     
//     // a standard transition
//     return 'normal';
//   },
//   
//   attach: function(template) {
//     var self = this, oldRender, newRender, type;
//     var dependency = new Deps.Dependency;
//     
//     self.container = template.find('.transitioner-panes');
//     self.leftPane = template.find('.left-pane');
//     self.rightPane = template.find('.right-pane');
//     
//     // call this after each transition is setup, ready for the next time
//     var done = function() {
//       // save for next time
//       oldRender = newRender;
//       self._nextTransitionType = null;
//     }
//     
//     var onSetTemplate = function(render) {
//       
//     }
//     
//     // XXX: "monkey patching" to achieve a router.onSetTemplate hook
//     // first order of business is adding this to the router.
//     // 
//     // The main reason we need to do this is to ensure we can call
//     // stopPaneRendering _before_ the template is actually set.
//     // 
//     // otherwise we are relying on computations being stopped in the
//     // right order, which feels like a bit of a house of cards to be honest
//     var oldSetTemplate = self.router.setTemplate;
//     self.router.setTemplate = function(template, to) {
//       if (!to || to === '__main__') {
//         onSetTemplate({
//           template: template, controller: this._currentController
//         });
//       }
//       oldSetTemplate.call(this, template, to);
//     }
//     
//     // call it once (perhaps the router calls it once or something)
//     onSetTemplate({
//       template: self.router._page.yieldsToTemplates.get('__main__'),
//       controller: self.router._currentController
//     });
//     
//   },
//   
//   setNextTransitionType: function(type) {
//     this._nextTransitionType = type;
//   },
//   
//   back: function() {
//     this.setNextTransitionType('back');
//     history.back()
//   },
//   
//   transitionStart: function(type, from, to) {
//     var self = this;
//     
//     // kill exisiting transition
//     self.transitioning && self.transitionEnd();
//     self.transitioning = true;
//     
//     self.renderToNextPane(self.leftIsNext ? self.leftPane : self.rightPane);
//     self.leftIsNext = ! self.leftIsNext;
//     
//     var classes = type;
//     if (_.isString(from.template))
//       classes = classes + ' from-' + from.template;
//     if (_.isString(to.template))
//       classes = classes + ' to-' + to.template;
//     $(self.container).addClass(self.lastTransitionClasses = classes)
//     
//     self.container.offsetWidth; // force a redraw
//     
//     $(self.container).addClass('transitioning')
//       .on(self._transitionEvents, function(e) {
//         if (! $(e.target).is(self.container))
//           return;
//         
//         self.transitionEnd();
//       });
//   },
//   
//   transitionEnd: function() {
//     var self = this;
//     // console.log('transitionEnd', self.currentPage, self.nextPage);
//     
//     // switch classes around
//     if (self.currentPage) {
//       $(self.currentPage).removeClass('current-page');
//       
//       self.clearPane(self.currentPage);
//     }
//     self.makeCurrentPage(self.nextPage);
//     
//     // finish.
//     $(self.container).removeClass('transitioning ' + self.lastTransitionClasses)
//       .off(self._transitionEvents);
//     
//     self.transitioning = false;
//   },
//   
//   stopPaneRendering: function(pane) {
//     // XXX: should we stop a computation here?
//     // console.log('finalizing pane', pane);
//     Spark.finalize(pane);
//   },
//   
//   clearPane: function(pane) {
//     // console.log('clearing pane', pane)
//     // XXX: just in case? -- get rid of this
//     Spark.finalize(pane);
//     pane.innerHTML = '';
//   },
//   
//   renderToPane: function(pane) {
//     // console.log('rendering to pane', pane)
//     var self = this;
//     
//     pane.appendChild(Spark.render(function() {
//       // console.log('in the spark.render block')
//       // render the current page to the current pane
//       var html = self.router._page._renderTemplate();
//       return html
//     }));
//   },
//   
//   renderToNextPane: function(pane) {
//     this.renderToPane(pane);
//     this.makeNextPage(pane);
//   },
//   
//   makeCurrentPage: function(pane) {
//     this.currentPage = pane;
//     $(pane).removeClass('next-page').addClass('current-page');
//   },
//   
//   makeNextPage: function(pane) {
//     this.nextPage = pane;
//     $(pane).removeClass('current-page').addClass('next-page');
//   }
// }
// 
// Template.transitionerPanes.rendered = function() {
//   // console.log('transitionerPanes is rendered!')
//   if (! this.attached) {
//     this.attached = true;
//     Transitioner.attach(this);
//   }
// }