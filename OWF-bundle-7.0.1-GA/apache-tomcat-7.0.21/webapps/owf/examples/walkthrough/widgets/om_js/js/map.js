var MapView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'get_latest_profile', 'plot_profile','addLayertoMap');

    var that = this;

    var terr = L.tileLayer('http://{s}.tiles.mapbox.com/v3/asamap.map-p0q0dl08/{z}/{x}/{y}.png', {visible:false}),
    imgry  = L.tileLayer('http://{s}.tiles.mapbox.com/v3/asamap.map-ijjg5918/{z}/{x}/{y}.png', {visible:false}),
    asabase = L.tileLayer('http://{s}.tiles.mapbox.com/v3/asamap.asabase1/{z}/{x}/{y}.png', {visible:false}),
    esocean = L.esri.basemapLayer("Oceans", {visible:true}),
    charts = L.tileLayer.wms('http://egisws02.nos.noaa.gov/ArcGIS/services/RNC/NOAA_RNC/ImageServer/WMSServer?',{
       layers : "RNC/NOAA_RNC"
     });

    this.map = L.map('map', {
      center: new L.LatLng(28, -82),
      zoom: 7,
      maxZoom: 11,
      minZoom: 3,
      loadingControl: true,
      layers: [esocean]
    });

    this.map.on('click', this.publishMapClick);

    var baseMaps = {
      "RPS Map": asabase,
      "ESRI Oceans": esocean,
      "Imagery": imgry,
      "Terrain": terr,
      "Charts": charts
    };

    // initialize time slider
    var $timesliderdetail = $('#timesliderlabel .detail');
    this.timesliderdate = new Date().toISOString();

    //default time slider to two days back and two days ahead
    //set time slider in the middle
    var time = new Date();
    var backtime = new Date();
    backtime.setDate(backtime.getDate() - 2);
    $('#timeslider').slider({
      value: 2,
      min: backtime.getTime() - (backtime.getSeconds()*1000) - ((backtime.getHours()%3) * 3600000) - (backtime.getMinutes() * 60000),
      max: time.getTime() + 60*60*24*2*1000, // 3 days in the future
      step: 60*60*3*1000, // 3 hour step increments
      slide: function(event, ui) {
        var unixtime = ui.value
          , timestr = new Date(unixtime).toLocaleString();
        //  console.log(time);
        $timesliderdetail.html(timestr.slice(0,-6) + ' ' + timestr.substr(-2));
        
      },
      stop: function (event,ui){
        var unixtime = ui.value
          , timestr = new Date(unixtime);
        //converting to UTC - show local time in the header bar but send UTC time to EDS WMS
        var utcTimeSting = new Date(timestr.toUTCString());
        that.trigger('timesliderChange', utcTimeSting.toLocaleString());
        that.timesliderdate = new Date(unixtime).toISOString();
      }
    });
    
    //set the time slider for the middle of the slider
    $('#timeslider .ui-slider-handle').css('left', '50%')
    this.bind('timesliderChange',this.updateTime);

    $('.ui.dropdown').dropdown();
    $('#observs')
      .dropdown('setting',{
         onChange : this.changeObs
         }
      )
    ;

    L.control.layers(baseMaps).addTo(this.map);
    this.model.set('selectProperted', '');

    //subscribe
    owfdojo.addOnLoad(function() {
      OWF.ready(that.startOWF);
    });   
  },

  //timeslider change
  updateTime: function(evt){
    var newTime = evt;
    //publish map time on change
    OWF.Eventing.publish("mapTimeChange", newTime);
  },

  publishMapClick:function(evt){
    OWF.Eventing.publish("leafletMapClick", evt);
  },

  mapMarkerClick: function(mrker){
    OWF.Eventing.publish("leafletmarkerClick",mrker);
  },

  startOWF: function(){
    //Listeners to channels
    OWF.Eventing.subscribe("add2Map", function (sender, msg, channel) {
                // this is for SOS services - right now we have to have the interaction (click)
                // function for data in the map JS -- Not Ideal - change later
                if(msg._layers){
                  var markers = L.layerGroup();
                  for (var i in msg._layers)
                  {
                      var marker = L.marker(msg._layers[i]._latlng, msg._layers[i].options);
                      marker.bindPopup(msg._layers[i]._popup._content);
                      marker.attributes = msg._layers[i].attributes;
                      marker.on('click',mapView.mapMarkerClick);
                      markers.addLayer(marker);
                  }
                  mapView.map.addLayer(markers);
                }
                //for GeoJSON
                else if(msg.features){
                  L.geoJson(msg.features).addTo(mapView.map);
                }
                //for WMS layers
                else if(msg.wmsParams){
                    //for SAR layers
                    if(msg.wmsParams.SEARCHAREA){
                      var lay= L.tileLayer.sarWms(msg._url,msg.wmsParams);
                      lay.addTo(mapView.map);
                      //mapView.map.addLayer(lay);
                    }
                    else{
                      mapView.map.addLayer(L.tileLayer.betterWms(msg._url,{id:msg.wmsParams.layers,layers:msg.wmsParams.layers,zIndex:msg.wmsParams.zIndex}));
                    }
                }
                //Tileservice
                else if(msg._url){
                  mapView.map.addLayer(L.tileLayer(msg._url,msg.options));
                }
                //ArcGIS Dynamic Web services
                else if(msg.serviceUrl){
                  mapView.map.addLayer(L.esri.dynamicMapLayer(msg.serviceUrl,{options:msg.options}));
                }
        });
    OWF.Eventing.subscribe("removeFromMap", function (sender, msg, channel) {
                if(msg.wmsParams){
                  //I can't believe I have to do this
                  for(var l in mapView.map._layers){
                    if(mapView.map._layers[l].wmsParams && mapView.map._layers[l].wmsParams.layers == msg.wmsParams.layers){
                      mapView.map.removeLayer(mapView.map._layers[l]);
                    }
                  }
                }
                //remove geojson
                else if(msg.features){
                  //not working
                  mapView.map.removeLayer(L.geoJson(msg.features));
                }
                //remove tileservices
                else if(msg._url){
                  for(var l in mapView.map._layers){
                    if(mapView.map._layers[l]._url && mapView.map._layers[l]._url == msg._url){
                      mapView.map.removeLayer(mapView.map._layers[l]);
                    }
                  }
                }
                //remove ArcGIS Services
                else if(msg.serviceUrl){
                  for(var l in mapView.map._layers){
                    if(mapView.map._layers[l].serviceUrl && mapView.map._layers[l].serviceUrl == msg.serviceUrl){
                      if(mapView.map._layers[l]._layerParams.layers == msg._layerParams.layers){
                          mapView.map.removeLayer(mapView.map._layers[l]);
                      }
                    }
                  }
                }
                else{
                  for(var l in mapView.map._layers){
                    if(mapView.map._layers[l]._popup){
                      for(var gj in msg._layers){
                        if(mapView.map._layers[l]){
                          if(mapView.map._layers[l]._popup._content == msg._layers[gj]._popup._content){
                            mapView.map.removeLayer(mapView.map._layers[l]);
                          }
                        }
                      }
                    }
                  }
                }
        });
  },

  addLayertoMap: function(sender,msg){
    console.log(msg);
  },

  //drop down for NDBC observations
  changeObs: function(evt) {
    //turn layer on and checkbox on
    /*mapView.model.stationlayers['NDBC Stations'].addTo(mapView.map);
    var $stations = $(leftpanelView.$el.children('#stations'));
    var $layer = $($stations.children()[2]);
    var $checkbox_stations = $($layer.children('.checkbox'));
    $checkbox_stations.checkbox('enable');


    mapView.model.set('selectProperted', evt);
    //iterate through and only show the points that are have that sensor
    for(var marker in mapView.model.stationlayers['NDBC Stations']._layers)
    {
      var visibl = 0;
      //for cluster:  mapView.model.stationlayers['NDBC Stations']._featureGroup._layers
      for(var sensor in mapView.model.stationlayers['NDBC Stations']._layers[marker].attributes){
         if(evt == 'all'){
            visibl = 1;
         }
         else if(mapView.model.stationlayers['NDBC Stations']._layers[marker].attributes[sensor]== evt){
          visibl = 1;
         }
      }
      mapView.model.stationlayers['NDBC Stations']._layers[marker].setOpacity(visibl);
    }*/
  },

  get_latest_profile: function(sid) {
    var that = this
      , $content = $('#'+sid+'-station_popup_content')
      , $loader = $content.children('.loader');

    $loader.addClass('active');

    $.getJSON(
      'http://map.asascience.com/EGDataViewer/Scripts/proxy.php?http://imms.ehihouston.com/stations/'+sid+'/latest/JSON/?metric=True',
      { sid: sid },
      function(data) {
        $loader.removeClass('active');
        that.update_station_status($content, data.status_info);
        that.plot_profile($content, data.profile);
      }
    );
  },

  update_station_status: function($content, status) {
    var $status = $content.children('.status');

    if (status.status_code) {
      $status
        .prop('class', 'warning')
        .html(status.message);
    } else {
      $status
        .prop('class', '')
        .html(status.status);
    }
  },

  scrub_2d_data: function(data) {
    var i;

    for (i=0; i<data.length; i++) {
      if (!data[i][0] || !data[i][1]) {
        data.splice(i,1);
        i--;
      }
    }

    return data;
  },

  plot_profile: function($content, rawdata) {
    var $title = $content.children('.title')
      , $graph = $content.children('.graph')
      , depthsorteddata = []
      , $statis = $content.children('.warning')
      , directionsorteddata = [];

    // merge 2 arrays together
    var i
      , direction_data = this.scrub_2d_data(rawdata.direction.data)
      , speed_data = this.scrub_2d_data(rawdata.speed.data);
    for (i=0; i<direction_data.length; i++) {
      depthsorteddata.push({
        depth: speed_data[i][1],
        speed: speed_data[i][0],
        direction: direction_data[i][0]
      });
    }

    directionsorteddata = depthsorteddata.slice(0);
    directionsorteddata.sort(function(obj1, obj2) {
      return obj1.direction - obj2.direction;
    });

    if (rawdata.age <= 86400) {
      if($statis.length == 1){
        $content.css({height:'310px'});
      }
      else{
        $content.css({height:'281px'});
      }
      var tstamp = rawdata.speed.time;
      $title.html('Latest Profile: ' + tstamp);

      // graph code
      this.d3drawcompass($graph, directionsorteddata);
      this.d3drawverticalgraph($graph, depthsorteddata);
    } 
    else {
      $title.html('');
      $graph.html('<p class="warning centered">No profile within the past 24 hrs.</p>');
    }
  },

  d3drawverticalgraph: function($graph, data) {
    var margin = {top: 5, right: 1, bottom: 5, left: 40},
      width = 130 - margin.left - margin.right,
      height = 190 - margin.top - margin.bottom;

    var svg = d3.select($graph.children('svg')[0])
      .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
          .range([0, width]); // width

    var y = d3.scale.linear()
        .range([height, 0]); // height

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(2)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.speed); })
        .y(function(d) { return y(d.depth); });

//    x.domain(d3.extent(data, function(d) { return d.speed }));
//    y.domain(d3.extent(data, function(d) { return d.depth }));
      x.domain([0,0.8]);
      y.domain([-1200,0]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+height+")")
        .call(xAxis)

    svg.append('g')
        .attr('transform', 'translate(0,200)')
      .append('text')
        .attr('x', 65)
        .attr('y', 0)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Speed (m/s)');

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -25)
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Depth (m)");     

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', 150)
      .attr('height', 174)
      .attr('transform', 'translate(-60,0)')
      .on('mouseover', function() { arrow.style('display', null); })
      .on('mouseout', function() { arrow.style('display', 'none'); })
      .on('mousemove', mousemove);

    svg.append("image")
      .attr('x',44)
      .attr('y',-9)
      .attr('width', 133)
      .attr('height', 16)
      .attr("xlink:href","../om_js/images/legend_rose.jpg");

    var updatedSpeed = svg.append("text")
      .attr('x',90)
      .attr('y',30);

    var mxspd = 0;
    var atdepth = 0;
    for (m=0; m<data.length; m++) {
        if (mxspd < data[m].speed) {
          mxspd = data[m].speed;
          atdepth = data[m].depth;
        }
      };
    var maxSpeed = svg.append("text")
      .attr('x',-15)
      .attr('y',221)
      .text('Max:' + mxspd.toPrecision(2)+ ' m/s at '+ atdepth +'m');

    var arrow = d3.select($graph.children('svg')[0]).append('g')
      .style('display', 'none')
      .attr('transform', 'translate(235,105)');

    var arrowline = arrow.append('line')
        .attr('x1', 0)
        .attr('y1', -86)
        .attr('x2', 0)
        .attr('y2', 0)
        .style('stroke', '#404040')
        .style('stroke-width', '3px');

    var arrowhead = arrow.append('polygon')
      .attr('points', '-10,70 0,90 10,70 -10,70')
      .style('fill', '#404040');

    function mousemove() {
      var y0 = y.invert(d3.mouse(this)[1])
        , i;

      for (i=0; i<data.length; i++) {
        if (y0 > data[i].depth) {
          break;
        }
      }

      if (data[i]) {
        var direction = data[i].direction
          , speedscale = data[i].speed*90;

        updatedSpeed.text(data[i].speed.toPrecision(2)+ ' m/s');

        arrowline
          .attr('transform', 'rotate(' + direction + ')')
          .attr('y1', -speedscale);
        arrowhead
          .attr('points', '-9,'+(speedscale)+' 0,'+(speedscale+13)+' 9,'+(speedscale)+' -10,'+(speedscale))
          .attr('transform', 'rotate(' + (direction-180)  + ')');
      }
    }
  },

  d3drawcompass: function($graph, data) {
    var points = []
      , max = 0
      , j=0;
    for (i=0; i<360; points.push({ direction: i, speed: max }), i+=22.5) {
      max = 0;
      for (;j<data.length; j++) {
        if (data[j].direction > i)
          break;

        if (data[j].speed > max)
          max = data[j].speed;
      }
    }

    var diameter = 250;

    var svg = d3.select($graph[0]).append("svg")
        .attr('width', 380)
        .attr('height', 250)
      .append("g")
        .attr('transform', 'translate(235,105)');

    var scaleradius = d3.scale.linear()
      .range([0, diameter / 2]);

    var line = d3.svg.line.radial()
      .radius(function(d) { return scaleradius(d.speed); })
      .angle(function(d) { return d.direction / 180 * Math.PI })

    for (i=1; i<=3; i++) {
      svg.append('circle')
        .attr('r', 90/Math.PI*i)
        .style('fill', 'none')
        .style('stroke', 'grey');
    }

    for(i=0; i<180; i+=22.5) {
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', -86)
        .attr('x2', 0)
        .attr('y2', 86)
        .style('stroke', 'grey')
        .attr('transform', 'rotate('+i+')');
    }

    svg.append('path')
      .datum(points)
      .attr('class', 'directionpath')
      .attr('d', function(d) { return line(d) + 'Z'; });

    // add directions
    svg.append('text')
      .attr('x', -8)
      .attr('y', -93)
      .style('font-size', '1.5em')
      .text('N');
    svg.append('text')
      .attr('x', 93)
      .attr('y', 8)
      .style('font-size', '1.5em')
      .text('E');
    svg.append('text')
      .attr('x', -8)
      .attr('y', 110)
      .style('font-size', '1.5em')
      .text('S');
    svg.append('text')
      .attr('x', -115)
      .attr('y', 9)
      .style('font-size', '1.5em')
      .text('W'); 
  },
});