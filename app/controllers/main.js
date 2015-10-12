import Ember from 'ember';

var MainController = Ember.Controller.extend({

    actions: {
        goToMom: function () {
            console.warn('transition To Mom');
            this.transitionToRoute('mom');
        }
    }
});

export default MainController;
