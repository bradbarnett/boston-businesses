/**
 * Created by Alicia on 8/14/17.
 */

var map = new L.Map("map", {
    center: new L.LatLng(42.346619076210494, -71.07707977294922),
    zoom: 15,
    zoomControl: true,
    attributionControl: false
});

//Add base layer
// L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
L.tileLayer('https://api.mapbox.com/styles/v1/bradrbarnett/cj4vmkcmh14ma2sl9abafgxe4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhZHJiYXJuZXR0IiwiYSI6ImNqNGJhYnR6NjA4N2MzMnFwOWs2NjZ5ZzUifQ.ZtaKJSasjfx5Pl5D3raQkQ', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
    // tileSize: 512,
    // zoomOffset: -1
}).addTo(map);