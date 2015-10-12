import Ember from 'ember';

var ApplicationRoute = Ember.Route.extend({
    controllerName: 'application',

    routeTitle: function () {
        return 'Joe\'s App';
    },

    beforeModel: function () {
        this.transitionTo('main');
    }
});

export default ApplicationRoute;
