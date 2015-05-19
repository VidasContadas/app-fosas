$(document).ready(function(){
	/* Inicializando las visualizaciones disponibles*/
	var mapas = $('<ul class="nav nav-pills nav-stacked">');
	for (var i in vidasConfig){
        vis = vidasConfig[i];
        mapas.append('<li><a href="#" data='+i+'>'+vis.name+'</a></li>');
	}
	$('#mapas').append(mapas);

	function createSelector(layer){
	    var $options = $('#mapas li a');
	    $options.click(function(e) {
	      e.preventDefault();
	      // get the area of the selected layer
	      var $li = $(e.target);
	      var selected = $li.hasClass('selected');
	      var type = $li.attr('data');
	      var css = $('#'+type+'-css').html();
	      var query = $('#'+type+'-sql').html();
	      var legend = $('#'+type+'-legend').html();
	      console.log('Ejecutando query ' + query);
	      if(query!=layer.getSQL() && query!=undefined){
	    	  layer.setSQL(query);  
	      }
	      console.log('cartocss ');
	      layer.setCartoCSS(css);
	      if(legend!=undefined){
	    	  console.log('Legend');
	    	  $('.cartodb-legend').html(legend);
	      }
	    });
	}
	
	options = {
			shareable : false,
			search : false,
			infowindow: true,
			legends: true
	};
	cartodb.createVis('map','https://vidascontadas.cartodb.com/api/v2/viz/428f764e-fd5d-11e4-a183-0e4fddd5de28/viz.json',options)
	.done(function(vis, layers) {
	    // layer 0 is the base layer, layer 1 is cartodb layer
	    // when setInteraction is disabled featureOver is triggered
	    layers[1].setInteraction(true);
        var subLayer = layers[1].getSubLayer(0);
        subLayer.infowindow.set({'template':$('#fosa-tpl').html(),'width':'400','maxHeight':'400'});
        createSelector(subLayer);
	    // you can get the native map to work with it
	    var map = vis.getNativeMap();

	    // now, perform any operations you need, e.g. assuming map is a L.Map object:
	    // map.setZoom(3);
	    // map.panTo([50.5, 30.5]);
	  });
});
