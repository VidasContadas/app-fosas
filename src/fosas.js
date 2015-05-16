$(document).ready(function(){
	/* Inicializando las visualizaciones disponibles*/
	var visualizaciones = $('<ul>');
	console.log(vidasConfig);
	for (var i in vidasConfig){
        vis = vidasConfig[i];
        console.log(vis);
        visualizaciones.append('<li data='+i+'>'+vis.name+'</li>');
	}
	$('#visualizaciones').append(visualizaciones);
	
	options = {
			shareable : false,
			search : false,
			infowindow: true,
			legends: true
	};
	cartodb.createVis('map','https://vidascontadas.cartodb.com/api/v2/viz/fb561928-fa31-11e4-acb2-0e0c41326911/viz.json',options)
	.done(function(vis, layers) {
	    // layer 0 is the base layer, layer 1 is cartodb layer
	    // when setInteraction is disabled featureOver is triggered
	    layers[1].setInteraction(true);
        var subLayer = layers[1].getSubLayer(0);
        subLayer.infowindow.set({'template':$('#fosa-tpl').html(),'width':'400','maxHeight':'400'});
	    // you can get the native map to work with it
	    var map = vis.getNativeMap();

	    // now, perform any operations you need, e.g. assuming map is a L.Map object:
	    // map.setZoom(3);
	    // map.panTo([50.5, 30.5]);
	  });
});
