import Ember from 'ember';

var MainRoute = Ember.Route.extend({
  controllerName: 'main',

  routeTitle: function() {
    return 'Joe\'s Home';
  }
});

export default MainRoute;
