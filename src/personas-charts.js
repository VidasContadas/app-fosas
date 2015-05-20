$(document).ready(
		function() {
			var sql = new cartodb.SQL({user:'jmcp'});
			var svg_prov, svg_fosa;
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				//var main = document.getElementById('fosas_actuacion');
				//var viewportWidth = (Math.min(main.clientWidth,window.innerWidth) || 500);
				viewportWidth = 500;
				var width = viewportWidth * 0.8, 
				height = viewportWidth * 0.7,
				format = d3.format(",d"), 
				color = d3.scale.category20c();

				var bubble = d3.layout.pack().sort(null).size(
						[ width, height]).padding(1.5);

				var svg_prov = d3.select("#provincia")
					.append("svg").attr("width", width)
					.attr("height", height)
					.attr("class", "bubble");
				/* Distribución de víctimas  total */

				sql.execute("SELECT provincia_fin as label,count(provincia_fin) as count FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by count")
					.done(function(data){
						if(data.total_rows>0){
							var total = 0;
							var children = []
							$.each(data.rows,function(index,item){
								children.push({id:"bubble-"+(index+1),name:item.label,value:item.count});
							});
							var nodes = {id:"bubble-0",children:children};
							var node = svg_prov.selectAll('.node')
								.data(bubble.nodes(nodes))
								.enter()
								.append('g')
									.attr('class','node')
									.attr('id',function(d){return d.id})
									.attr('transform',function(d){ return "translate(" + d.x + "," + d.y + ")";});
							
							node.append("title").text(function(d) {
								return d.name + ": " + format(d.value);
							});

							node.append("circle").attr("r", function(d) {
								return d.r;
							}).style("fill", function(d) {
								return color(d.name);
							});

							node.append("text")
								.attr("dy", ".3em")
								.style("text-anchor","middle").text(function(d) {
									text = d.name + " (" + format(d.value)+")";
								return text.substring(0, d.r / 3);
							});
						}
					})
					.error(function(errors){
						
					});

				/* Provincia hombres*/
				sql.execute("SELECT provincia_fin as label,count(provincia_fin) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL AND sexo IN ('hombre') group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prov_hom").append('svg');
						    d3.select("#prov_hom svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Provincia mujeres*/
				sql.execute("SELECT provincia_fin as label,count(provincia_fin) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL AND sexo IN ('mujer') group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prov_muj").append('svg');
						    d3.select("#prov_muj svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});
				

				/* Sucesos total */
				var diameter = 250, 
				height = 200,
				format = d3.format(",d"), 
				color = d3.scale.category20c();

				var bubble = d3.layout.pack().sort(null).size(
						[ diameter, height]).padding(1.5);

				var svg_prov = d3.select("#suceso")
					.append("svg").attr("width", diameter)
					.attr("height", height)
					.attr("class", "bubble");

				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value")
					.done(function(data){
						if(data.total_rows>0){
							var total = 0;
							var children = []
							$.each(data.rows,function(index,item){
								children.push({id:"bubble-"+(index+1),name:item.label,value:item.value});
							});
							var nodes = {id:"bubble-0",children:children};
							var node = svg_prov.selectAll('.node')
								.data(bubble.nodes(nodes))
								.enter()
								.append('g')
									.attr('class','node')
									.attr('id',function(d){return d.id})
									.attr('transform',function(d){ return "translate(" + d.x + "," + d.y + ")";});
							
							node.append("title").text(function(d) {
								return d.name + ": " + format(d.value);
							});

							node.append("circle").attr("r", function(d) {
								return d.r;
							}).style("fill", function(d) {
								return color(d.name);
							});

							node.append("text")
								.attr("dy", ".3em")
								.style("text-anchor","middle").text(function(d) {
									text = d.name + " (" + format(d.value)+")";
								return text.substring(0, d.r / 3);
							});
						}
					})
					.error(function(errors){
						
					});

				/* Sucesos hombres*/
				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL AND sexo IN ('hombre') group by label order by value desc")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#suceso_hom").append('svg');
						    d3.select("#suceso_hom svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Sucesos mujeres*/
				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL AND sexo IN ('mujer') group by label order by value desc")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#suceso_muj").append('svg');
						    d3.select("#suceso_muj svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Sucesos coruña*/
				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value desc")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#suceso_cor").append('svg');
						    d3.select("#suceso_cor svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Sucesos lugo*/
				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('Lugo') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value desc")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#suceso_lug").append('svg');
						    d3.select("#suceso_lug svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Sucesos ourense*/
				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value desc")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#suceso_our").append('svg');
						    d3.select("#suceso_our svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Sucesos pontevedra*/
				sql.execute("SELECT suceso as label,count(suceso) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('Pontevedra') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value desc")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#suceso_pon").append('svg');
						    d3.select("#suceso_pon svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Profesiones total */
				var diameter = 500, 
				height = 400,
				format = d3.format(",d"), 
				color = d3.scale.category20c();

				var bubble = d3.layout.pack().sort(null).size(
						[ diameter, height]).padding(1.5);

				var svg_prov = d3.select("#profesion")
					.append("svg").attr("width", diameter)
					.attr("height", height)
					.attr("class", "bubble");

				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by profesion_sector order by value")
					.done(function(data){
						if(data.total_rows>0){
							var total = 0;
							var children = []
							$.each(data.rows,function(index,item){
								children.push({id:"bubble-"+(index+1),name:item.label,value:item.value});
							});
							var nodes = {id:"bubble-0",children:children};
							var node = svg_prov.selectAll('.node')
								.data(bubble.nodes(nodes))
								.enter()
								.append('g')
									.attr('class','node')
									.attr('id',function(d){return d.id})
									.attr('transform',function(d){ return "translate(" + d.x + "," + d.y + ")";});
							
							node.append("title").text(function(d) {
								return d.name + ": " + format(d.value);
							});

							node.append("circle").attr("r", function(d) {
								return d.r;
							}).style("fill", function(d) {
								return color(d.name);
							});

							node.append("text")
								.attr("dy", ".3em")
								.style("text-anchor","middle").text(function(d) {
									text = d.name + " (" + format(d.value)+")";
								return text.substring(0, d.r / 3);
							});
						}
					})
					.error(function(errors){
						
					});

				/* Profesiones hombres*/
				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL AND sexo IN ('hombre') group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prof_hom").append('svg');
						    d3.select("#prof_hom svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Profesiones mujeres*/
				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña','Pontevedra','Lugo','Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL AND sexo IN ('mujer') group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prof_muj").append('svg');
						    d3.select("#prof_muj svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Profesiones coruña*/
				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('A Coruña') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prof_cor").append('svg');
						    d3.select("#prof_cor svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Profesiones lugo*/
				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('Lugo') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prof_lug").append('svg');
						    d3.select("#prof_lug svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Profesiones ourense*/
				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('Ourense') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prof_our").append('svg');
						    d3.select("#prof_our svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

				/* Profesiones pontevedra*/
				sql.execute("SELECT profesion_sector as label,count(profesion_sector) as value FROM galizadb_v2_2 WHERE provincia_fin IN ('Pontevedra') AND provincia_fin IS NOT NULL AND fecha_muerte IS NOT NULL group by label order by value")
				.done(function(data){
					nv.addGraph(function() {
						  var chart = nv.models.pieChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .showLabels(true)     //Display pie labels
						      .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
						      .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
						      .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
						      .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
						      ;

						  console.log(data.rows);
						    d3.select("#prof_pon").append('svg');
						    d3.select("#prof_pon svg")
						        .datum(data.rows)
						        .transition().duration(350)
						        .call(chart);

						  return chart;
						});
				})
				.error(function(errors){
					
				});

			});
		});

$(document).ready(
		function() {
			var sql = new cartodb.SQL({user:'jmcp'});
		});