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

Tinytest.add('TransitionedPageManager - no transition when data changes', function (test) {
  var pageManager = new TransitionedPageManager;
  
  var frag = Spark.render(function() {
    return pageManager.renderLayout();
  });
  var div = new OnscreenDiv(frag);
  
  pageManager.setTemplate('one');
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one not rendered');
  
  pageManager.setData({foo: 'bar'});
  Deps.flush();
  test.equal(div.text().trim(), 'One', 'one re-rendered');
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
