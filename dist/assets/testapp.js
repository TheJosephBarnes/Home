/* jshint ignore:start */

/* jshint ignore:end */

define('testapp/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'testapp/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('testapp/components/sidebar-component', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var SidebarComponent = Ember['default'].Component.extend({
        classNames: ['sidebar-component'],

        actions: {
            routeTo: function routeTo(route) {
                Ember['default'].transitionToRoute(route);
            }
        }
    });

    exports['default'] = SidebarComponent;

});
define('testapp/controllers/application', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var ApplicationController = Ember['default'].Controller.extend({});

	exports['default'] = ApplicationController;

	//TODO

});
define('testapp/controllers/league', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var key = 'baa99618-c7cf-4252-8e77-5acb728fdf48';

    var LeagueController = Ember['default'].Controller.extend({
        playerName: null,
        playerId: null,
        summonerIconId: null,
        summonerIconSrc: null,
        playerDivision: null,
        playerTier: null,
        playerLeague: null,
        playerLP: null,

        champions: [],

        rankBorder: '',

        getPlayerData: (function () {
            var self = this;
            var id;
            var playerPromise = Ember['default'].RSVP.cast(Ember['default'].$.ajax({ //GRAB PLAYER DATA
                type: 'get',
                url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/tenshi39?api_key=' + key
            }));

            playerPromise.then(function (data) {
                id = data.tenshi39.id;
                self.set('playerName', data.tenshi39.name);
                self.set('playerId', id);
                self.set('summonerIconId', data.tenshi39.profileIconId);
            }).then(function () {
                var dataPromise = Ember['default'].$.ajax({ //GRAB RANKED DIVISION DATA
                    type: 'get',
                    url: 'https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + id + '/entry?api_key=' + key
                });

                dataPromise.then(function (data) {
                    self.set('playerLeague', data[id][0].name);
                    self.set('playerRank', data[id][0].tier);
                    self.set('playerDivision', data[id][0].entries[0].division);
                    self.set('playerLP', data[id][0].entries[0].leaguePoints);
                }).then(function () {
                    var rankedPromise = Ember['default'].$.ajax({ //GRAB RANKED STATISTICS
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
                        _.forEach(champs, function (champion) {
                            self.get('champions').pushObject(champion);
                        });
                    });
                });
            });
        }).on('init'),

        getIconSource: (function () {
            var id = this.get('summonerIconId');
            var href = 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/' + id + '.png';
            this.set('summonerIconSrc', href);
        }).observes('summonerIconId'),

        getBorder: (function () {
            var link = 'assets/images/borders/' + this.get('playerRank') + '.png';
            this.set('rankBorder', link);
        }).observes('playerRank')
    });

    exports['default'] = LeagueController;

});
define('testapp/controllers/main', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MainController = Ember['default'].Controller.extend({

        actions: {
            goToMom: function goToMom() {
                console.warn('transition To Mom');
                this.transitionToRoute('mom');
            }
        }
    });

    exports['default'] = MainController;

});
define('testapp/controllers/mom', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var MomController = Ember['default'].Controller.extend({});

	exports['default'] = MomController;

	//TODO

});
define('testapp/initializers/app-version', ['exports', 'testapp/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('testapp/initializers/export-application-global', ['exports', 'ember', 'testapp/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('testapp/router', ['exports', 'ember', 'testapp/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    Router.map(function () {
        this.route('mom', { path: 'mom' });

        this.route('main', { path: 'main' });

        this.route('league', { path: 'league' });
    });

    exports['default'] = Router;

});
define('testapp/routes/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ApplicationRoute = Ember['default'].Route.extend({
        controllerName: 'application',

        routeTitle: function routeTitle() {
            return 'Joe\'s App';
        },

        beforeModel: function beforeModel() {
            this.transitionTo('main');
        }
    });

    exports['default'] = ApplicationRoute;

});
define('testapp/routes/league', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var LeagueRoute = Ember['default'].Route.extend({
    controllerName: 'league',

    routeTitle: function routeTitle() {
      return 'League of Legends';
    }
  });

  exports['default'] = LeagueRoute;

});
define('testapp/routes/main', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var MainRoute = Ember['default'].Route.extend({
    controllerName: 'main',

    routeTitle: function routeTitle() {
      return 'Joe\'s Home';
    }
  });

  exports['default'] = MainRoute;

});
define('testapp/routes/mom', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var MomRoute = Ember['default'].Route.extend({
    controllerName: 'mom',

    routeTitle: function routeTitle() {
      return 'Happy Mother\'s Day';
    }
  });

  exports['default'] = MomRoute;

});
define('testapp/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","app-sidebar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","app-main");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        content(env, morph0, context, "sidebar-component");
        content(env, morph1, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('testapp/templates/components/sidebar-component', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            Home\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            Current League Data\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sidebar-title");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sidebar-links");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","link home-link");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","link lol-link");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        block(env, morph0, context, "link-to", ["main"], {}, child0, null);
        block(env, morph1, context, "link-to", ["league"], {}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('testapp/templates/league', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","league-header");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","summoner-info");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","icon");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","icon-border");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","icon-image");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("img");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","name");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","summoner-overview");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","rank");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" (");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("), ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" LP\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element2, [1, 1]);
        var element4 = dom.childAt(element2, [3, 1]);
        var element5 = dom.childAt(element0, [3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        var morph1 = dom.createMorphAt(element5,1,1);
        var morph2 = dom.createMorphAt(element5,3,3);
        var morph3 = dom.createMorphAt(element5,5,5);
        var morph4 = dom.createMorphAt(element5,7,7);
        element(env, element3, context, "bind-attr", [], {"src": get(env, context, "rankBorder")});
        element(env, element4, context, "bind-attr", [], {"src": get(env, context, "summonerIconSrc")});
        content(env, morph0, context, "playerName");
        content(env, morph1, context, "playerLeague");
        content(env, morph2, context, "playerRank");
        content(env, morph3, context, "playerDivision");
        content(env, morph4, context, "playerLP");
        return fragment;
      }
    };
  }()));

});
define('testapp/templates/main', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1,"id","title");
        var el2 = dom.createTextNode("It's a Home Page");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\nBrought to you by Ember.js™\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","mothers-day-link hidden");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"href","");
        var el3 = dom.createTextNode("\n        Happy Mother's Day!\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        element(env, element0, context, "action", ["goToMom"], {});
        return fragment;
      }
    };
  }()));

});
define('testapp/templates/mom', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","mom-title");
        var el2 = dom.createTextNode("\n    Hey mom!\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","mom-message");
        var el2 = dom.createTextNode("\n    Happy Mother's Day!\n\n    A poem in gifs, just for you:\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","gif-poem");
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Sometimes we might annoy you,");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/b3g9SBi10CDMk?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","283");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Sometimes we don't listen to you like we should,");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/2SBiRrfpVZEYg?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","202");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Sometimes we try to explain our mistakes,");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/3STFqR93FXsqI?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","270");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("And don't like to admit we're wrong,");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/ZE8dspq6yBruo?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","196");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("You keep us from doing dumb things,");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/N1q8Nx82j6Kxa?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","368");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("And sometimes we don't deal with that very well,");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/DPOMjp6AhlJ5K?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","360");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("And yet you still put up with us.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("That's why you're awesome");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/RyvaihB82Vsis?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","311");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("And that's why we love you!");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("iframe");
        dom.setAttribute(el3,"src","//giphy.com/embed/d5YvW6O5RswxO?html5=true");
        dom.setAttribute(el3,"width","480");
        dom.setAttribute(el3,"height","269");
        dom.setAttribute(el3,"frameBorder","0");
        dom.setAttribute(el3,"webkitAllowFullScreen","");
        dom.setAttribute(el3,"mozallowfullscreen","");
        dom.setAttribute(el3,"allowFullScreen","");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n          ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","outro");
        var el4 = dom.createTextNode("\n              HAPPY MOTHER'S DAY!\n          ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('testapp/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(false, 'app.js should pass jshint.\napp.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 2, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 3, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 4, col 1, \'import\' is only available in ES6 (use esnext option).\napp.js: line 18, col 1, \'export\' is only available in ES6 (use esnext option).\n\n5 errors'); 
  });

});
define('testapp/tests/components/sidebar-component.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/sidebar-component.js should pass jshint', function() { 
    ok(false, 'components/sidebar-component.js should pass jshint.\ncomponents/sidebar-component.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncomponents/sidebar-component.js: line 13, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(false, 'controllers/application.js should pass jshint.\ncontrollers/application.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncontrollers/application.js: line 7, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/controllers/league.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/league.js should pass jshint', function() { 
    ok(false, 'controllers/league.js should pass jshint.\ncontrollers/league.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncontrollers/league.js: line 82, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/controllers/main.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/main.js should pass jshint', function() { 
    ok(false, 'controllers/main.js should pass jshint.\ncontrollers/main.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncontrollers/main.js: line 13, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/controllers/mom.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/mom.js should pass jshint', function() { 
    ok(false, 'controllers/mom.js should pass jshint.\ncontrollers/mom.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\ncontrollers/mom.js: line 7, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/helpers/resolver', ['exports', 'ember/resolver', 'testapp/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('testapp/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('testapp/tests/helpers/start-app', ['exports', 'ember', 'testapp/app', 'testapp/router', 'testapp/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('testapp/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('testapp/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(false, 'router.js should pass jshint.\nrouter.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nrouter.js: line 2, col 1, \'import\' is only available in ES6 (use esnext option).\nrouter.js: line 16, col 1, \'export\' is only available in ES6 (use esnext option).\n\n3 errors'); 
  });

});
define('testapp/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nroutes/application.js: line 15, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/routes/league.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/league.js should pass jshint', function() { 
    ok(false, 'routes/league.js should pass jshint.\nroutes/league.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nroutes/league.js: line 11, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/routes/main.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/main.js should pass jshint', function() { 
    ok(false, 'routes/main.js should pass jshint.\nroutes/main.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nroutes/main.js: line 11, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/routes/mom.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/mom.js should pass jshint', function() { 
    ok(false, 'routes/mom.js should pass jshint.\nroutes/mom.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nroutes/mom.js: line 11, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/test-helper', ['testapp/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('testapp/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('testapp/tests/views/application.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/application.js should pass jshint', function() { 
    ok(false, 'views/application.js should pass jshint.\nviews/application.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nviews/application.js: line 3, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/views/league.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/league.js should pass jshint', function() { 
    ok(false, 'views/league.js should pass jshint.\nviews/league.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nviews/league.js: line 8, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/views/main.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/main.js should pass jshint', function() { 
    ok(false, 'views/main.js should pass jshint.\nviews/main.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nviews/main.js: line 8, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/tests/views/mom.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/mom.js should pass jshint', function() { 
    ok(false, 'views/mom.js should pass jshint.\nviews/mom.js: line 1, col 1, \'import\' is only available in ES6 (use esnext option).\nviews/mom.js: line 8, col 1, \'export\' is only available in ES6 (use esnext option).\n\n2 errors'); 
  });

});
define('testapp/views/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].View.extend({
        templateName: 'application',
        classNames: ['application-view']
    });

});
define('testapp/views/league', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var LeagueView = Ember['default'].View.extend({
    templateName: 'league',
    classNames: ['league-view']
  });

  exports['default'] = LeagueView;

});
define('testapp/views/main', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var MainView = Ember['default'].View.extend({
    templateName: 'main',
    classNames: ['main-view']
  });

  exports['default'] = MainView;

});
define('testapp/views/mom', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var MomView = Ember['default'].View.extend({
        templateName: 'mom',
        classNames: ['mom-view']
    });

    exports['default'] = MomView;

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('testapp/config/environment', ['ember'], function(Ember) {
  var prefix = 'testapp';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("testapp/tests/test-helper");
} else {
  require("testapp/app")["default"].create({"name":"testapp","version":"0.0.0.cdbb4f1a"});
}

/* jshint ignore:end */
//# sourceMappingURL=testapp.map