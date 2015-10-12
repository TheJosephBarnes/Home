import Ember from 'ember';

var LeagueRoute = Ember.Route.extend({
  controllerName: 'league',

  routeTitle: function() {
    return 'League of Legends';
  }
});

export default LeagueRoute;
