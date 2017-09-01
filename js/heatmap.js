/**
 * Created by Alicia on 8/27/17.
 */




var earlyMorningLocations;
var heat;
var blurValue = 50;
var radiusValue = 22;



$(function() {
function sliderSetup(id) {
    $("#" + id).slider({
        min: 1,
        max: 50,
        value: (id == "blur-slider") ? 50 : 15
    });

    var startPos = $("#" + id).slider("value");
    endPos = '';

    $("#" + id).on("slidestop", function(event, ui) {
        console.log("stop")
        endPos = ui.value;

        if (startPos != endPos && id == "blur-slider") {
            console.log(endPos);
            blurValue = endPos;
        }
        else if (startPos != endPos && id == "radius-slider") {
            radiusValue = endPos;
        }

        startPos = endPos;
        setHeatLevel(blurValue,radiusValue);
    });
}

sliderSetup("blur-slider");
sliderSetup("radius-slider");
});

var map = new L.Map("map", {
    center: new L.LatLng(42.346619076210494, -71.07707977294922),
    zoom: 13,
    zoomControl: true,
    attributionControl: false
});

//Add base layer
// L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
L.tileLayer('https://api.mapbox.com/styles/v1/bradrbarnett/cj5r5xhgf2duy2rl8bqc4juyy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhZHJiYXJuZXR0IiwiYSI6ImNqNGJhYnR6NjA4N2MzMnFwOWs2NjZ5ZzUifQ.ZtaKJSasjfx5Pl5D3raQkQ', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
    // tileSize: 512,
    // zoomOffset: -1
}).addTo(map);


$.getJSON("data/0500-midnight.geojson", function (data) {
    console.log(data.features);
    // add GeoJSON layer to the map once the file is loaded
    earlyMorningLocations = data.features.map(function(d) {
        var lat = (d.geometry) ? d.geometry.coordinates[1] : 0;
        var lng = (d.geometry) ? d.geometry.coordinates[0] : 0;
        var value = 1;
        return [lat,lng,value];
    })

    var _heat = L.heatLayer(earlyMorningLocations,{
        blur: blurValue,
        radius: radiusValue,
        gradient: {0: 'transparent', 0.6: "#E8E867", 0.3: '#30BBCE'}

    }).addTo(map);

    heat = _heat;
});



function setHeatLevel(blurValue,radiusValue) {
    heat.setOptions({
        blur: blurValue,
        radius: radiusValue
    })
}