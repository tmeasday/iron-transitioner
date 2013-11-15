Router.map(function() {
  this.route('one', {path: '/'});
  this.route('two');
})

if (Meteor.isClient) {
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
