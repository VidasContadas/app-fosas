/**
 * 
 */
function VisualizacionFosas(name,sql,cartocss){
	this.name = name;
	this.sql = sql;
	this.css = cartocss;
}

var vidasConfig = new Array();
vidasConfig['tipo']= new VisualizacionFosas(
		'Fosas por tipo',
		'SELECT * FROM fosas',
		'#fosas_andalucia {marker-fill-opacity: 0.9;marker-line-color: #FFF;marker-line-width: 1.5;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-allow-overlap: true;}#fosas_andalucia[tipo="Barranco"] {marker-fill: #A6CEE3;}#fosas_andalucia[tipo="Carretera/Camino"] {marker-fill: #1F78B4;}#fosas_andalucia[tipo="Cementerio exterior"] {marker-fill: #B2DF8A;}#fosas_andalucia[tipo="Cementerio interior"] {marker-fill: #33A02C;}#fosas_andalucia[tipo="No definido"] {marker-fill: #FB9A99;}#fosas_andalucia[tipo="Otros"] {marker-fill: #E31A1C;}#fosas_andalucia[tipo="Vaguada/Barranco"] {marker-fill: #FDBF6F;}#fosas_andalucia[tipo="Zona edificada"] {marker-fill: #FF7F00;}#fosas_andalucia[victimas<1000]{marker-width:10;}#fosas_andalucia[victimas>1000]{marker-width:20;}#fosas_andalucia[victimas>2000]{marker-width:30;}#fosas_andalucia[victimas>3000]{marker-width:40;}');
vidasConfig['evolucion']= new VisualizacionFosas(
		'Evolución de las Fosas',
		'SELECT * FROM fosas',
		'/** torque_heat visualization */Map {-torque-frame-count:512;-torque-animation-duration:10;-torque-time-attribute:"fecha";-torque-aggregation-function:"count(cartodb_id)";-torque-resolution:10;-torque-data-aggregation:cumulative;}#fosas{image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);marker-fill-opacity: 0.4*[value];marker-width: 35;}#fosas[frame-offset=1] {marker-width:37;marker-fill-opacity:0.2; }#fosas[frame-offset=2] {marker-width:39;marker-fill-opacity:0.1;}');