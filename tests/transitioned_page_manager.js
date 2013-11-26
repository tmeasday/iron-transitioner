Tinytest.add('TransitionedPageManager - basic rendering', function (test) {
  var pageManager = new TransitionedPageManager;
  
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one not rendered');
});

Tinytest.add('TransitionedPageManager - basic transitioning', function (test) {
  var pageManager = new TransitionedPageManager;
  
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one not rendered');
  
  pageManager.setTemplate('two');
  Deps.flush();
  test.matches(div.text().trim(), /One\s+Two/, 'two not rendered alongside');
  
  pageManager.endTransitions();
  Deps.flush();
  test.equal(div.text().trim(), 'Two', 'one not cleared');
});

Tinytest.add('TransitionedPageManager - no changes when data changes', function (test) {
  var pageManager = new TransitionedPageManager;
  
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one not rendered');
  var oneDiv = div.div.children[0].children[0].children[0];
  
  pageManager.setData({foo: 'bar'});
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one re-rendered');
  test.equal(div.div.children[0].children[0].children[0], oneDiv, 'new oneDiv rendered!');
});

Tinytest.add('TransitionedPageManager - non transitioned yield', function (test) {
  var pageManager = new TransitionedPageManager;
  
  pageManager.setLayout('standardLayout');
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one not rendered');
  
  pageManager.setTemplate('two');
  Deps.flush();
  test.equal(div.text().trim(), 'Two', 'one not cleared');
});


Tinytest.add('TransitionedPageManager - correct classes set', function (test) {
  var pageManager = new TransitionedPageManager;
  
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  
  pageManager.setTemplate('two');
  Deps.flush();
  
  var classes = div.div.children[0].className;
  test.matches(classes, /default/, 'No type class set on div');
  test.matches(classes, /from-one/, 'No from class set on div');
  test.matches(classes, /to-two/, 'No to class set on div');
});

Tinytest.add('TransitionedPageManager - transitionType function', function (test) {
  var pageManager = new TransitionedPageManager;
  pageManager.transitionType = function() {
    return 'special';
  }
  
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  
  pageManager.setTemplate('two');
  Deps.flush();
  
  var classes = div.div.children[0].className;
  test.matches(classes, /special/, 'No special class set on div');
});
