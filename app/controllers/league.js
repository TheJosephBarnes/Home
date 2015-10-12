import Ember from 'ember';

var key = 'baa99618-c7cf-4252-8e77-5acb728fdf48';

var LeagueController = Ember.Controller.extend({
    playerName: null,
    playerId: null,
    summonerIconId: null,
    summonerIconSrc: null,
    playerDivision: null,
    playerTier: null,
    playerLeague: null,
    playerLP: null,

    champions: [],

    rankBorder: "",

    getPlayerData: function () {
        var self = this;
        var id;
        var playerPromise = Ember.RSVP.cast (Ember.$.ajax({                                 //GRAB PLAYER DATA
            type: 'get',
            url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/tenshi39?api_key='+key
        }));

        playerPromise.then( function (data) {
            id = data.tenshi39.id;
            self.set('playerName', data.tenshi39.name);
            self.set('playerId', id);
            self.set('summonerIconId', data.tenshi39.profileIconId);
        }).then( function () {
            var dataPromise = Ember.$.ajax({                                                //GRAB RANKED DIVISION DATA
                type: 'get',
                url: 'https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + id + '/entry?api_key=' + key
            });

            dataPromise.then(function (data) {
                self.set('playerLeague', data[id][0].name);
                self.set('playerRank', data[id][0].tier);
                self.set('playerDivision', data[id][0].entries[0].division);
                self.set('playerLP', data[id][0].entries[0].leaguePoints);
            }).then( function () {
                var rankedPromise = Ember.$.ajax({                                          //GRAB RANKED STATISTICS
                    type: 'get',
                    url: 'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + id + '/ranked?api_key=' + key
                });

                rankedPromise.then(function (data) {
                    /*
                     data {
                        champions: [Object] {
                            id,
                            stats [Object] {
                                --stats
                            }
                        }
                     }
                    * */

                    var champs = data.champions;
                    _.forEach(champs, function(champion) {
                        self.get('champions').pushObject(champion);
                    });
                });
            });
        });
    }.on('init'),

    getIconSource: function () {
        var id = this.get('summonerIconId');
        var href = 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/' + id + '.png';
        this.set('summonerIconSrc', href);
    }.observes('summonerIconId'),

    getBorder: function () {
        var link = "assets/images/borders/" + this.get('playerRank') + ".png";
        this.set('rankBorder', link);
    }.observes('playerRank')
});

export default LeagueController;
