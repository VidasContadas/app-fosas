$(document).ready(function(){
	/* Inicializando las visualizaciones disponibles*/
	var mapas = $('<ul class="nav nav-pills nav-stacked">');
	var index = 0;
	for (var i in vidasConfig){
        vis = vidasConfig[i];
        selected = (index==0) ? 'class="active"':'';
        mapas.append('<li '+selected+'><a href="#" data='+i+'>'+vis.name+'</a></li>');
        index++;
	}
	$('#mapas').append(mapas);

	var map;
	var torqueLayer;

	function createSelector(layer,map){
	    var $options = $('#mapas li a');
	    $options.click(function(e) {
	      e.preventDefault();
	      // get the area of the selected layer
	      var $li = $(e.target);
	      $("#mapas li").removeClass('active');
	      var selected = $li.parent().hasClass('active');
	      if(!selected){
	    	  $li.parent().addClass('active');
	      }
	      var type = $li.attr('data');
	      var css = $('#'+type+'-css').html();
	      var query = $('#'+type+'-sql').html();
	      var legend = $('#'+type+'-legend').html();
	      var config = vidasConfig[type];
	      if(!config.torque){
	    	  if(torqueLayer!=undefined){
	    		  if(torqueLayer.isRunning()){
	    			  torqueLayer.setStep(0);
	    		  }
	    		  torqueLayer.hide();
	    		  $('.cartodb-timeslider').hide();
	    		  layer.show();
	    	  }
		      if(query!=layer.getSQL() && query!=undefined){
		    	  layer.setSQL(query);
		      }
		      layer.setCartoCSS(css);
		      if(legend!=undefined){
		    	  $('.cartodb-legend').html(legend);
		      }
	      }
	      else{
	    	layer.hide();
	    	if(torqueLayer == undefined){
			    torqueConfig = {
						type:'torque',
						options:{
							'user_name':'jmcp',
							'table_name':'galizadb_v2_2',
							'loop':false,
							'cartocss': css}
					};
				cartodb.createLayer(map,torqueConfig)
				.addTo(map)
				.done(function(layer){
					torqueLayer = layer;
				})
				.error(function(errors){
				});
	    	}
	    	else{
	    		torqueLayer.show();
				$('.cartodb-timeslider').show();
	    	}
	      }
	    });
	}

	options = {
			shareable : false,
			search : false,
			infowindow: true,
			legends: true,
	};
	cartodb.createVis('map','https://jmcp.cartodb.com/api/v2/viz/84085bfa-fee7-11e4-8982-0e853d047bba/viz.json',options)
	.done(function(vis, layers) {
	    // layer 0 is the base layer, layer 1 is cartodb layer
	    // when setInteraction is disabled featureOver is triggered
	    layers[1].setInteraction(true);
        var subLayer = layers[1].getSubLayer(0);
        //subLayer.infowindow.set({'template':$('#fosa-tpl').html(),'width':'400','maxHeight':'400'});
	    // you can get the native map to work with it
	    map = vis.getNativeMap();
        createSelector(subLayer,map);

	    // now, perform any operations you need, e.g. assuming map is a L.Map object:
	    // map.setZoom(3);
	    // map.panTo([50.5, 30.5]);
	  });
});
