import Ember from 'ember';

var SidebarComponent = Ember.Component.extend({
    classNames: ['sidebar-component'],

    actions: {
        routeTo: function (route) {
            Ember.transitionToRoute(route);
        }
    }
});

export default SidebarComponent;
