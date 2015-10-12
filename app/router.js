import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('mom', {path: 'mom'});

    this.route('main', {path: 'main'});

    this.route('league', {path: 'league'});
});

export default Router;
