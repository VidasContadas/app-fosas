$(document).ready(function(){

  $.getJSON('datasets/fosas-andalucia.geojson',function(data){
    var template = $('#fosa-tpl').html();
    Mustache.parse(template);

    var map = new L.Map('map', {zoom: 10, center: new L.latLng([37.383333, -5.983333]) });

    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer

    var featuresLayer = new L.GeoJSON(data, {
        onEachFeature: function(feature, marker) {
          marker.bindPopup(L.popup({maxWidth:'400px'}).setContent(Mustache.render(template,feature.properties)));
        }
      });

    map.addLayer(featuresLayer);

    var searchControl = new L.Control.Search({
      wrapper: 'findbox',
      layer: featuresLayer,
      propertyName: 'municipio',
      });

    searchControl.on('search_locationfound', function(e) {

      e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
      if(e.layer._popup)
        e.layer.openPopup();

    }).on('search_collapsed', function(e) {

      featuresLayer.eachLayer(function(layer) {	//restore feature color
        featuresLayer.resetStyle(layer);
      });
    });

    map.addControl( searchControl );  //inizialize search control
  });
});
/*
var map = new L.Map('map', {zoom: 9, center: new L.latLng(data[0].loc) });

map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer

var markersLayer = new L.LayerGroup();	//layer contain searched elements
map.addLayer(markersLayer);

map.addControl( new L.Control.Search({
  wrapper: 'findbox',
  callData:localData,
  markerLocation:true,
  //layer: markersLayer,
  initial: false,
  collapsed: false
}) );
//map.addControl( new L.Control.Search({callData: localData, text:'Color...', markerLocation:true}) );

function localData(text, callResponse)
{
  //here can use custom criteria or merge data from multiple layers

  callResponse(data);

  return {	//called to stop previous requests on map move
    abort: function() {
      console.log('aborted request:'+ text);
    }
  };
}
*/
