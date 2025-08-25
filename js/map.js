var map = L.map('map').setView([-6.927113, 106.928215], 13);

var G_Satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
   maxZoom: 20,
   minZoom: 4,
   subdomains: ["mt0", "mt1", "mt2", "mt3"],
   attribution: '&copy; Google Satellite'
});

var G_Street = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    minZoom: 4,
    subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy; Google Streets'
}).addTo(map);

var G_Terrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    minZoom: 4,
    subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy; Google Terrain'
});

var OpenStreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 4,
    attribution: '&copy; OpenStreetMap'
});


// Layer Styles \\
var pointIcon = L.icon({
	iconUrl: 'img/home.png',
	iconSize: [16, 16],
    iconAnchor: [16, 16],
    popupAnchor: [0, -32]
});

var pointIcon2 = L.icon({
	iconUrl: 'img/wanita.png',
	iconSize: [16, 16],
    iconAnchor: [16, 16],
    popupAnchor: [0, -32]
});

// Data Alumni \\
function pop_dataAlumni(feature, layer){
	if(feature.properties) {
		var content = "<table class='table table-sm table-striped table-borderless'>" +
					"<tr><th>Enumerator</th><td>" + feature.properties.Enumerator + "</td></tr>" +
					"<tr><th>Pekerjaan Responden</th><td>" + feature.properties.PekerjaanResponden + "</td></tr>" +
					"<tr><th>Pendidikan Terakhir</th><td>" + feature.properties.PendidikanTerakhir + "</td></tr>" +
					"<tr><th>Kalurahan</th><td>" + feature.properties.Kalurahan + "</td></tr>" +
					"<tr><th>Kecamatan</th><td>" + feature.properties.Kecamatan + "</td></tr>" +
					"<tr><th>Koordinat (X/Y)</th><td>" + feature.properties.Koordinat_X + ", " + feature.properties.Koordinat_Y +"</td></tr>" +
					"<tr><th>Navigasi Ke Alamat</th><td><a class='badge badge-secondary' role='button' href='https://www.google.com/maps/dir/?api=1&destination=" + feature.properties.Koordinat_Y + "," + feature.properties.Koordinat_X + "&travelmode=driving' target='_blank'>Lihat Rute</a></td></tr>" +
					"<tr><th>Foto Narasumber</th><td><a class='badge badge-secondary' role='button' href= "+ feature.properties.FotoNarasumber + " target='_blank'>Lihat Foto Narasumber</a></td></tr>" +
					"<tr><th>Foto Rumah </th><td><a class='badge badge-secondary' role='button' href= "+ feature.properties.FotoRumah + " target='_blank'>Lihat Foto Rumah</a></td></tr>" +
					"</table>";

		layer.on({
			click: function (e) {
				$('#feature-title').html(feature.properties.Enumerator);
				$('#feature-info').html(content);
				$('#featureModal').modal('show');
				titikRumah.bindTooltip(feature.properties.Enumerator +"&nbsp;"+"(Kalurahan"+"&nbsp;"+ feature.properties.Kalurahan +")");

				}
		});
	}
	layer.setIcon(pointIcon);

}
var titikRumah = new L.GeoJSON.AJAX('php/dataalumnigeografiuny.php', {
	onEachFeature: pop_dataAlumni,
			
}).addTo(map);


// Batas Administrasi Kab\\
var adminStyle = {
  fillOpacity: "0",
  color: '#0a0a0a',
  weight: 1,
  opacity: 1,
  dashArray: '3'
};

function pop_AdmKab(feature, layer) {
  if (feature.properties) {
    var content = "<table class='table table-sm table-striped table-borderless'>" +
      "<tr><th>Kecamatan</th><td>" + feature.properties.WADMKC + "</td></tr>" +
      "</table>";
    layer.on({
      click: function (e) {
        batasAdminKab.bindPopup(content);
      }
    });
  }
};

var batasAdminKab = new L.GeoJSON.AJAX('data/sukabumi_desa.geojson.geojson', {
  onEachFeature: pop_AdmKab,
  style: adminStyle
}).addTo(map);





var basemaps = {
	label: '<b> Tampil Basemaps</b>',
	children: [
        {label: " Google Streets", layer: G_Street},
        {label: " Google Satellite", layer: G_Satellite},
        {label: " Google Terrain", layer: G_Terrain},
        {label: " Open Street Map", layer: OpenStreet},
    ]
};


var grupLayers = {
	label: '<b> KETERANGAN (DATA DAN RUMAH)</b>',
	selectAllCheckbox: true,
	children: [
	
	{label: '<b> <a href="https://forms.gle/DN47UzkY4DAGCp6m9" target="_blank">ISI FORM TAMBAH DATA</a></b>', 
	selectAllCheckbox: true,
	children: [
		//{label: "&nbsp;<img src='img/XXX.png' width='20'> xxx", layer: batasAdmin},
		]},
	
	{label: '<b> <a href="https://docs.google.com/spreadsheets/d/1ZT33s1qMe5gRYuKZwt1H3sP2IFJtYFBrZeffBbgkTcw/edit?usp=sharing" target="_blank">TAMPILKAN DATA</a></b>', 
	selectAllCheckbox: true,
	children: [
		]},

	{label: '<b> RUMAH RESPONDEN </b>', 
	selectAllCheckbox: true, children: [
		{label: "&nbsp;<img src='img/home.png' height='20'> Titik Alamat", layer: titikRumah},
		]},

	]
	
};

var layerTree = L.control.layers.tree(basemaps, grupLayers, {
	collapsed: false
});
layerTree.addTo(map).setBaseTree(basemaps).collapseTree(true).expandTree(true);

L.control.defaultExtent().addTo(map);

//Logo watermark
L.Control.Watermark = L.Control.extend({
	onAdd: function(map) {
		var img = L.DomUtil.create('img');
		img.src = 'img/Logo_Sukabumi.png';
		img.style.width = '50px';
			return img;},
	onRemove: function(map) {
		// Nothing to do here
		}
		});
L.control.watermark = function(opts) {
	return new L.Control.Watermark(opts);}
L.control.watermark({ position: 'bottomleft' }).addTo(map);

//ScaleBar
L.control.scale({
  maxWidth: 100,
  imperial: true,
  position: "bottomleft"
}).addTo(map);

//Mouse Position
L.control.mousePosition(
{position: "bottomleft"
}).addTo(map);

//Graticule
L.latlngGraticule({
			showLabel: true,
			color: '#4B0082',
			zoomInterval: [
				{start: 2, end: 3, interval: 20},
				{start: 4, end: 4, interval: 7.5},
				{start: 5, end: 7, interval: 5},
				{start: 8, end: 9, interval: 0.25},
				{start: 10, end: 13, interval: 0.125},
				{start: 14, end: 16, interval: 0.03125},
			]
		}).addTo(map);

// get coordinate
map.on('click',
function(e){
var coord = e.latlng.toString().split(',');
var lat = coord[0].split('(');
var lng = coord[1].split(')');
alert("Lokasi Klik Anda: Latitude: " + lat[1] + " and Longitude:" + lng[0] + ".  "+ "Catat / Salin kemudian masukkan di Form");
});
window.load = main;
