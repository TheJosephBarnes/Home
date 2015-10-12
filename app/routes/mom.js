import Ember from 'ember';

var MomRoute = Ember.Route.extend({
  controllerName: 'mom',

  routeTitle: function() {
    return 'Happy Mother\'s Day';
  }
});

export default MomRoute;
