var LeftpanelView = Backbone.View.extend({
  initialize: function() {
  	_.bindAll(this, 'startTOC','addStation','popUp');

  	var that = this;
  		//subscribe
    	owfdojo.addOnLoad(function() {
      		OWF.ready(that.startTOC);

    	}); 
  },
  //to add dynamic wms layers
  addnewWMS: function(){
  		//
  },

  //Start up app with a call to EDS for WMS layers
  startTOC: function(){
  	//open/launch the map if not already open
  	var Mapguid;
  	var mapWidget = OWF.Preferences.getWidget({
    	universalName: 'org.owfgoss.owf.examples.oceansmap',
    	onSuccess: function(result) {
			Mapguid = result.path;
			OWF.Launcher.launch({
					guid: Mapguid, launchOnlyIfClosed: true});
		}
    });

  	var username = 'ozonewidget_ss'
      , password = 'ozone';

    if (username && password) {
      $.ajax({
        url: "http://map.asascience.com/EGDataViewer/Scripts/proxy.php?http://coastmap.com/ecop/wms.aspx?request=GetUserInfo&version=1.1.1",
        data: {
          username: username,
          pw: password
        }
      })
      .done(function(response) {
        if (window.DOMParser) {
          // if the login was successfull
          if (response.getElementsByTagName('defaultLayers')[0]) {

            var layers = response.getElementsByTagName('defaultLayers')[0].childNodes[0].nodeValue.split(',');
            
            //run the getCapabilities document for that software key
            if(response.getElementsByTagName('softwareKey')[0])
            {
              var request = OpenLayers.Request.GET(
              {
                url:
                "http://map.asascience.com/EGDataViewer/Scripts/proxy.php?http://coastmap.com/ecop/wms.aspx?REQUEST=GetCapabilities&service=1.1.1&key="+response.getElementsByTagName('softwareKey')[0].childNodes[0].nodeValue,
                success: function(response){
                      var format = new OpenLayers.Format.XML();
                      var xml = format.read(response.responseText);

                      var text = format.write(xml);

                      var CAPformat = new OpenLayers.Format.WMSCapabilities.v1_1_1();
                      var cap = CAPformat.read(xml);

                      var fulllayers = [];
                      for (var i=0; i<cap.capability.layers.length;i++)
                      {
                           fulllayers.push(cap.capability.layers[i])
                      }
                      leftpanelView.initializeoverlays(fulllayers);
                 }
               })
              }
              else{
                  leftpanelView.initializeoverlays(layers);
              };
          } else { // not authorized
            alert('username/password not found');
          }
        }
      });
    } else {
      alert('No username or password provided');
    }

	//add realtime data -- SOS and ADCP JSON services
	this.initializerealtime();
	//Add tiled overlays and Arc GISServer
	this.initializegislayers();
  },

  initializerealtime: function() {
    var that = this;

    this.model.stationlayers = {};

    function bindlistele(layer, popuphtml, enablecheckbox) {
      var $stations = $('#stations')
        , html
        , popuptitle

      html = "<div class='item'>"
           +   "<div class='ui checkbox toggle'>"
           +     "<input type='checkbox' />"
           +     "<label style='font-size:14px;'>" + layer + "</label>"
           +   "</div>"
           +   "<i data-position='bottom left' class='help icon link' style='position: absolute; right: 0px; padding-top: 10px;' "
           +     "data-html='<h4 style=\"text-align:center;\" class=\"ui header\">" + layer + '</h4>' + popuphtml + "'></i>"
           + "</div>";

      $stations
        .append(html);

      var $obsinfo = $('#obsinfo');
      $obsinfo.children('i').popup();

      // select elements
      var $layer = $stations.children().last()
        , $checkbox = $layer.children('.checkbox')
        , $helppopup = $layer.children('i');

      $checkbox
        .checkbox({
          onEnable: function() {
          	OWF.Eventing.publish("add2Map", that.model.stationlayers[layer]);
          },
          onDisable: function() {
            OWF.Eventing.publish("removeFromMap", that.model.stationlayers[layer]);
          }
        })
      ;

      $helppopup.popup();

      if (enablecheckbox) {
        $checkbox.checkbox('enable');
        //that.model.stationlayers[layer].addTo(that.map);
      }
    }
    // add adcp
    /*$.getJSON('http://map.asascience.com/EGDataViewer/Scripts/proxy.php?http://imms.ehihouston.com/stations/JSON/', function(response) {
      that.model.stationlayers['ADCP Stations'] = L.geoJson(response, {
      	pointToLayer: that.addStation,
        onEachFeature: that.popUp
      });
      bindlistele('ADCP Stations', '<p style="text-align:center;">Observation stations from RPS Evan Hamilton, provide real time profile conditions at that location. <p style="text-align:center;"><img src="../om_js/images/adcp_leg.jpg" ><img src="../om_js/images/rps.png" ></p>', true); // true to enable layer
    });*/

    //add ndbc sos
    addndbcstations(this); // <img src="../images/points/warning.png" >
    bindlistele('NDBC Stations', '<p style="text-align:center;">Click to view time series for different observed properties from the National Buoy Service. <p style="text-align:center;"><img src="../om_js/images/noaa-logo.png" ></p>');
 },
  initializegislayers: function() {
    var that = this;

    this.model.gislayers = {};

    function bindlistele(layer, popuphtml, enablecheckbox) {
      var $lays = $('#layerTOC')
        , html
        , popuptitle

      html = "<div class='item'>"
           +   "<div class='ui checkbox toggle'>"
           +     "<input type='checkbox' />"
           +     "<label style='font-size:14px;'>" + layer + "</label>"
           +   "</div>"
           +   "<i data-position='top left' class='help icon link' style='position: absolute; right: 0px; padding-top: 10px;' "
           +     "data-html='<h4 style=\"text-align:center;\" class=\"ui header\">" + layer + '</h4>' + popuphtml + "'></i>"
           + "</div>";

      $lays
        .append(html);

      // select elements
      var $layer = $lays.children().last()
        , $checkbox = $layer.children('.checkbox')
        , $helppopup = $layer.children('i');

      $checkbox
        .checkbox({
          onEnable: function() {
          	OWF.Eventing.publish("add2Map", that.model.gislayers[layer]);
          },
          onDisable: function() {
          	OWF.Eventing.publish("removeFromMap",  that.model.gislayers[layer]);
          }
        })
      ;

      $helppopup.popup();

      if (enablecheckbox) {
        $checkbox.checkbox('enable');
        //that.model.gislayers[layer].addTo(that.map);
      }
    }

    //SAR Layer
    this.model.gislayers['Drifter Model'] = L.tileLayer.sarWms('http://map.asascience.com/EGDataViewer/Scripts/proxy.php?http://172.16.16.124/oilmapwebservice20/DrawModel.aspx?', {
        layers: 'model',
		    scenario_id:126,
    		OM_SPILLETS:true,
    		OM_CONTOUR:false,
    		lang:0,
    		transparent:true,
    		OM_SWEPT:true,
    		OM_TRACKLINE:false,
    		SEARCHAREA:true,
    		format:'image/png',
    		session_id:'15_alzm10677AL106',
    		PROBABILITYGRID:false,
    		DAYNIGHTICON:false,
    		SUMMARYTABLE:false,
    		user_id:15,
        time:'2014-03-30T16:40:00',
        zIndex:3000
      });
    bindlistele('Drifter Model', '<p style="text-align:center;"><p style="text-align:center;"></p>');
    
    // add arc gis layer
    this.model.gislayers['ArcGIS GIS Server'] = L.esri.dynamicMapLayer('http://gis.asascience.com/ArcGIS/rest/services/oilmap/oceansmap/MapServer',{zIndex:4000});
    bindlistele('ArcGIS GIS Server', '<p style="text-align:center;"><p style="text-align:center;"><img src="../om_js/images/ags_legend.jpg" ></p>');
    
     //weather
    this.model.gislayers['Current Precipitation'] = L.tileLayer('http://{s}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png', {visible:false,zIndex:1000, opacity:.4, attribution: 'Map data © OpenWeatherMap'});
    bindlistele('Current Precipitation', '<p style="text-align:center;">Current Quantity of precipitation Coverage : provided by Open Weather Map<p style="text-align:center;"><img src="../om_js/images/PR.png" ></p>');
  },

  //EDS Layers
  initializeoverlays: function(wmsoverlays) {
    var that = this
      , i
      , html
      , $modelslist = $('#modelslist')
      , overlays = wmsoverlays;

    //that.model.layers = wmsoverlays;
    //models popup
    var $edsinfo = $('#edsinfo');
    $edsinfo.children('i').popup();

    function bindlistele(html, layer) {
     $modelslist
        .append(html)
      .children().last() // select new element to bind to
        .checkbox({
          onEnable: function() {
          	OWF.Eventing.publish("add2Map",  that.model.layers[layer]);
          },
          onDisable: function() {
          	OWF.Eventing.publish("removeFromMap",  that.model.layers[layer]);
          }
        })
      ;
    }

    //initiate map variables
    this.model.layers = {};
    this.model.set('selectProperted', "");
    
    for (i=0; i<overlays.length; i++) {
      var popuphtml =  '<p style="text-align:center;"><p style="text-align:center;"><img src="http://coastmap.com/ecop/wms.aspx?layers='+ overlays[i].name+'&transparent=true&styles=&request=GetLegendGraphic&width=112&version=1.1.1&format=image/png&height=155"></p>';

       html = "<div class='item' style='padding-bottom: 6px;'>"
           +   "<div class='ui checkbox toggle' style='margin-left: -30px;'>"
           +     "<input type='checkbox' />"
           +     "<label style='font-size:14px;'>" + overlays[i].title + "</label>"
           +   "</div>"
           +   "<i data-position='bottom left' class='help icon link' style='position: relative; right: -248px; margin-top: -3px;' "
           +     "data-html='" + popuphtml + "'></i>"
           + "</div>";
       this.model.layers[overlays[i].title] = L.tileLayer.betterWms('http://map.asascience.com/EGDataViewer/Scripts/proxy.php?http://coastmap.com/ecop/wms.aspx?', {
        layers: overlays[i].name,
        format: 'image/png',
        //add three for the list of basemap layers
        zIndex: overlays.length + i+3
      });

      bindlistele(html, overlays[i].title);

      var $layer = $modelslist.children().last()
        , $helppopup = $layer.children('i');
      $helppopup.popup({position:'bottom right'});
    };
  },

  addStation: function(f,l) {
    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#00CC00",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    if (f.properties.status == "Critical") {
      geojsonMarkerOptions.fillColor = "#CC0000";
    } else if (f.properties.status == "Warning") {
      geojsonMarkerOptions.fillColor = "#CCCC00";
    } else if (f.properties.status == "Inactive") {
      geojsonMarkerOptions.fillColor = "#777777";
    } else {
      geojsonMarkerOptions.fillColor = "#00CC00";
    }
    var stationMarker = new L.StationMarker(l, geojsonMarkerOptions);
    return stationMarker;
//    return new L.StationMarker(l, geojsonMarkerOptions);
  },

  popups: {},
  popUp: function(f,l) {
    var out = []
      , popup = L.popup({ minWidth: 330 })
      , html = '<div id="'+f.id+'-station_popup_content">'
          // href="' + document.URL + '"
             + '<strong><a>' + f.properties.name + '</a></strong><br />'
             + 'Status: <span class="status"></span><br />'
             + '<div class="title"></div><br />'
             + '<div class="ui active inline medium loader" style="width: 100%; margin: 0 auto;"></div>'
             + '<div class="graph"></div><br />'
             + '</div>';

    popup.setContent(html);
    leftpanelView.popups[f.properties.id] = popup;
    l.bindLabel(f.properties.name,{ direction: 'auto'});
    l.bindPopup(popup);
  }
});

leftpanelView = new LeftpanelView({
    el: document.getElementById('leftpanel'),
    model: new Backbone.Model({
      overlays: []
    })
});