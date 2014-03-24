// Login View
var LoginView = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'login');

    var that = this;
    
    $('#login .ui.checkbox')
      .checkbox({
        onEnable: function() {
          $('#loginbutton')
            .removeClass('disabled')
            .on('click', that.login)
          ;
        },
        onDisable: function() {
          $('#loginbutton')
            .addClass('disabled')
            .off('click', that.login)
          ;
        }
      })
    ;
  },

  login: function() {
    var that = this;

    // first check that the us/pw/checkbox is filled
    var username = $('#username').val()
      , password = $('#password').val(); 
  }     
});

var RightcontainerView = Backbone.View.extend({
  initialize: function() {
    this.model = new Backbone.Model();

    this.model.state = 'fullscreen';
  }
});

var TopbarView = Backbone.View.extend({
  events: {
    'click a.launch.item.active' : 'toggleleftpanel'
  },

  initialize: function() {
    //_.bindAll(this, 'toggleleftpanel');
  }
});

/*for dev*/
$('#map').show();
$('#mainappcontainer').show();

$(document).ready(function() {

  // login view
  loginView = new LoginView();

/////////////////////////////////////////////////////
  // for dev only
/////////////////////////////////////////////////////
  // will eventually copy this code to the
  // successful login callback

  rightcontainerView = new RightcontainerView({
    el: document.getElementById('rightcontainer')
  });

  topbarView = new TopbarView({
    el: document.getElementById('topbar')
  });

  mapView = new MapView({
    el: document.getElementById('map'),
    model: new Backbone.Model({
      overlays: [
        'HYCOM_GLOBAL_CURRENTS',
        'WW3_WAVE_HEIGHT',
        'GFS_WINDS',
        'HYCOM_GLOBAL_NAVY_SST',
        'GFS_AIR_PRESSURE'
      ]
    })
  });

});