/*jslint browser: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $*/
/*global L*/
/*global getColor*/

var map;
var northB = [51.26, 34.71];
var southB = [40.61, 15.26];

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 16,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    //bounds: new L.LatLngBounds(southB, northB),
    noWrap: true,
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});

map = L.map("map", {
    zoom: 7,
    center: [46.07, 25.19],
    layers: [mapquestOSM],
    zoomControl: true,
    attributionControl: true,
    maxZoom: 16,
    minZoom: 6,
    zoomAnimation: false,
    maxBounds: new L.LatLngBounds(southB, northB)
});
if (L.Browser.touch) {
    L.control.touchHover().addTo(map);
}


var topoLayer = new L.TopoJSON();
var layerData = {};


function addTopoData(topoData) {
    topoLayer.addData(topoData);
    topoLayer.addTo(map);
    topoLayer.eachLayer(handleLayer);
}


function handleLayer(layer) {
    layer.feature.properties.primar = layerData[layer.feature.id].primar;
    layer.feature.properties.id_partid = parseInt(layerData[layer.feature.id].id_partid_actual);

    layer.setStyle({
        fillColor: getColor(layer.feature.properties.id_partid),
        fillOpacity: 0.9,
        color: '#555',
        weight: 1,
        opacity: 1
    });

    layer.on({
        mouseover: enterLayer,
        mouseout: leaveLayer
    });
}


var $maptooltip = $('.map-tooltip');
$maptooltip.html('<h4>Campaign tracker 2014</h>').show();

function enterLayer() {
    var name = 'Municipality of <b>' + toTitleCase(this.feature.properties.name) + '</b>';
    var primar = 'Mayor <b>' + toTitleCase(this.feature.properties.primar) + '</b>';
    var judet = '<b>' + this.feature.properties.jud_lbl + ' County</b>';
    var partid = getName(this.feature.properties.id_partid);
    var party_colour = '<div style="background-color:' + getColor(this.feature.properties.id_partid) + '">&nbsp;</div>';


    $maptooltip.html('<h4>Campaign tracker 2014</h4>' + judet + '</br>' + name + '</br>' + primar + '</br>' + party_colour + partid).show();
    this.bringToFront();
    this.setStyle({
        weight: 3,
        opacity: 1,
        color: 'red'
    });
}

function leaveLayer() {
    //$maptooltip.hide();
    $maptooltip.html('<h4>Campaign tracker 2014</h4>');
    this.bringToBack();
    this.setStyle({
        weight: 1,
        opacity: 1,
        color: '#555'
    });
}


function onEachFeature(feature, layer) {
    var popupContent = "<p>I started out as a GeoJSON " +
        feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }

    layer.bindPopup(popupContent);
}

function loadData() {
    $.ajax({
        type: "GET",
        url: site_url + "data/centralizator.geojson",
        dataType: "text",
        success: function (data) {
            L.geoJson([data], {

                style: function (feature) {
                    return feature.properties && feature.properties.style;
                },

                onEachFeature: onEachFeature,

                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: "#ff7800",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                }
            }).addTo(map);
        }
    });
}
loadData();