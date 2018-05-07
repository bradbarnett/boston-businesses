/**
 * Created by bbarnett on 8/23/2016.
 */
console.log(d3);


// Create leaflet map
// var map = new L.Map("map", {
//     setView: [42.346619076210494, -71.07707977294922],
//     zoom: 15,
//     zoomControl: true,
//     attributionControl: false
// });

var map = new L.map('map').setView([42.32752193319442, -71.07647895812988], 13);
var path = "/boston-businesses/";


//Add base layer
// L.tileLayer('https://api.mapbox.com/styles/v1/bradrbarnett/cj4wwddac2aq12rmsagbsp1fd/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhZHJiYXJuZXR0IiwiYSI6ImNqNGJhYnR6NjA4N2MzMnFwOWs2NjZ5ZzUifQ.ZtaKJSasjfx5Pl5D3raQkQ',{ //Dark Heatmap
//Dark L.tileLayer('https://api.mapbox.com/styles/v1/bradrbarnett/cj5r5xhgf2duy2rl8bqc4juyy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhZHJiYXJuZXR0IiwiYSI6ImNqNGJhYnR6NjA4N2MzMnFwOWs2NjZ5ZzUifQ.ZtaKJSasjfx5Pl5D3raQkQ',{
//  L.tileLayer('https://api.mapbox.com/styles/v1/bradrbarnett/cj4vmkcmh14ma2sl9abafgxe4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhZHJiYXJuZXR0IiwiYSI6ImNqNGJhYnR6NjA4N2MzMnFwOWs2NjZ5ZzUifQ.ZtaKJSasjfx5Pl5D3raQkQ', {
 L.tileLayer('https://api.mapbox.com/styles/v1/bradrbarnett/cj8niq92t2xpc2ss9tgpqosel/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhZHJiYXJuZXR0IiwiYSI6ImNqNGJhYnR6NjA4N2MzMnFwOWs2NjZ5ZzUifQ.ZtaKJSasjfx5Pl5D3raQkQ', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
    // tileSize: 512,
    // zoomOffset: -1
}).addTo(map);

// var Shared = new Shared();
// var urlPath = Shared.getUrl();
//
// $.getJSON(urlPath + "/data/MBTA-lines.geojson", function (data) {
//     // add GeoJSON layer to the map once the file is loaded
//     L.geoJson(data, {
//         style: function (feature) {
//             switch (feature.properties.LINE) {
//                 case 'RED':
//                     return {
//                         color: "#d13934",
//                         opacity: 1,
//                         weight: 4
//                     };
//                 case 'BLUE':
//                     return {
//                         color: "#027dc3",
//                         opacity: 1,
//                         weight: 4
//                     };
//                 case 'ORANGE':
//                     return {
//                         color: "#e58c28",
//                         opacity: 1,
//                         weight: 4
//                     };
//                 case'GREEN':
//                     return {
//                         color: "#008f4f",
//                         opacity: 1,
//                         weight: 4
//                     };
//                 case'SILVER':
//                     return {
//                         color: "transparent",
//                         opacity: 1,
//                         weight: 4
//                     };
//             }
//         }
//     }).addTo(map);
// })
// ;


//Add global variables
var width = window.innerWidth,
    height = window.innerHeight,
    _polygon,
    _polygonClass,
    _points,
    _pointsInside,
    _totalPlaces,
    _totalreviews,
    _totalGrocery,
    _totalBars,
    _totalRestaurants,
    _totalCivic,
    _totalActive,
    _totalShopping,
    _stationName = "--",
    _testIsochrone,
    _activeFeature,
    _distance = 5,
    _clickedItem = "restaurants",
    _totalProfessionalServices;

//Initiate map and svg merge
map._initPathRoot();

//Load data, then call runViz
// d3.queue()
//     .defer(d3.json, "../boston-businesses/data/stripped_data.geojson")
//     .defer(d3.json, "../boston-businesses/data/neighborhoods.geojson")
//     .await(runViz);

d3.queue()
    .defer(d3.json, "../data/stripped_data.geojson")
    .await(runViz);

//Set up map svg and annotation svg

var svg = d3.select(map.getPanes().overlayPane).select("svg"),
    isochroneGroups = {}, isochronesG = svg.append("g").attr("id", "isochrones-g");
var placeInfoSvg = d3.select("#places-info").append("svg").attr("width", 300).attr("height", 50).classed("places-info-svg", true);
var nameText = placeInfoSvg.append("text");
var reviewsText = placeInfoSvg.append("text");

//Create circles on map
function runViz(error, points) {
    console.log("done");

    // $.getJSON("data/neighborhoods.geojson", function (data) {
    //     console.log(data)
        // add GeoJSON layer to the map once the file is loaded
        // districts = L.geoJson(geojson, {
        //     onEachFeature: onEachFeature,
        //     style: style
        // }).addTo(map);
    // });

    function checkColor(d) {

        if (d.properties.STATION == _stationName) {
            return "rgba(71,71,71,1)"
        }
        else {
            return "white"
        }
    };

    function style(d) {
        return {
            color: "black",
            weight: 0,
            opacity: 0.3,
            fillColor: "black",
            fillOpacity: 0
        }
    }

    var dummyData = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -66.796875,
                        40.59727063442024
                    ],
                    [
                        -65.5224609375,
                        40.59727063442024
                    ],
                    [
                        -65.5224609375,
                        41.178653972331674
                    ],
                    [
                        -66.796875,
                        41.178653972331674
                    ],
                    [
                        -66.796875,
                        40.59727063442024
                    ]
                ]
            ]
        }
    }



    var lastClickedLayer;

    function highlightFeature(e) {
        var current = e.target;
        current.setStyle({
            weight: 3

        });
    }

    function resetHighlight(e) {
        var current = e.target;
        current.setStyle({
            weight: 1
        });
    }

    function whenClicked(e) {
        var current = e.target;
        districts.setStyle(style)
        current.setStyle({
            weight: 1,
            fillOpacity: 0
        })
        var stationName = current.feature.properties.Name;
        _stationName = stationName;
        $("#station").html(function () {
            return _stationName.replace(/\s+/g, ' ')
        })

        if (typeof lastClickedLayer != 'undefined') {
            if (current._id == lastClickedLayer._id) {
                if (lastClickedLayer._status == "on") {
                    districts.setStyle(style);
                    $("#station").html(function () {
                        return "--"
                    })
                    current._status = "off";
                    compareData(dummyData);
                    _activeFeature = dummyData;

                }
                else {
                    current._status = "on";
                    compareData(e.target.feature)
                    _activeFeature = e.target.feature;

                }
            }
            else {
                compareData(e.target.feature);
                _activeFeature = e.target.feature;
            }
        }
        else {
            compareData(e.target.feature)
            _activeFeature = e.target.feature;
        }


        // if (!isochroneGroups[_stationName]) {
        //
        //     drawIsochrones(_stationName, function () {
        //         changeIsochrone();
        //         showIsochrone();
        //         compareData();
        //     })
        // }
        // else {
        //     changeIsochrone();
        //     showIsochrone();
        //     compareData();
        // }
        lastClickedLayer = current;
    }

    function onEachFeature(feature, layer) {
        layer._id = feature.properties.Name;
        layer._status = "off";
        layer.on({
            click: whenClicked,
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    }


    if (error) throw error;
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var pointData = points.features;

    pointData.forEach(function (d) {
        if (d.geometry.coordinates[1] === null) {
            d.LatLng = new L.LatLng(0, 0)
        }
        else {
            d.LatLng = new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])

        }
    })

    pointData.sort(function (a, b) {
        return b.properties.reviews - a.properties.reviews;
    });
    var circles = g.selectAll("circle")
        .data(pointData)
        .enter()
        .append("circle")
        .attr("class", function(d) {
            if (d.properties.metacategory == "localservices,shopping") {
                var category = 'shopping'
            }
            else if (d.properties.metacategory == "financialservices,professional") {
                var category = 'professional'
            }
            else {
                var category = d.properties.metacategory
            }
            return category + " unselected on"
        })
        .attr("businessType", function(d) {
                if (d.properties.metacategory == "localservices,shopping") {
                    var category = 'shopping'
                }
                else if (d.properties.metacategory == "financialservices,professional") {
                    var category = 'professional'
                }
                else {
                    var category = d.properties.metacategory
                }
                return category
            })
        .attr("r", 5);
    pointsUpdate();
    map.on("viewreset", pointsUpdate);

    function pointsUpdate() {
        var max = d3.max(pointData, function (d) {
            return +d.properties.reviews;
        });
        var min = d3.min(pointData, function (d) {
            return +d.properties.reviews;
        });
        var oScale = d3.scaleLinear()
            .domain([min, max])
            .range([0.1, 0.5]);
            // .range([0.1, 0.5]);
        circles.attr("cx", function (d) {
            return map.latLngToLayerPoint(d.LatLng).x
        });
        circles.attr("cy", function (d) {
            return map.latLngToLayerPoint(d.LatLng).y
        });
        circles.attr("r", function (d) {
            if (d.properties.reviews > 10) {
                return Math.sqrt(parseInt(d.properties.reviews) * 0.15);
            }
            else if (d.properties.reviews > 50) {
                return Math.sqrt(parseInt(d.properties.reviews) * .05);
            }
            else {
                return 3;
            }
        });
        circles.attr("callit", function (d) {
            return d.Name
        });
        circles.attr("id", 0);
        circles.attr("fill-opacity",function(d) {
            return (Math.sqrt(oScale(d.properties.reviews) * 0.4))
        })
        // circles.style("fill", function (d) {
        //     if (d.properties.metacategory == "restaurants") {
        //         return "rgba(210, 84, 249," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "grocery") {
        //         return "rgba(252,255,0," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "active") {
        //         return "rgba(255, 160, 19," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "localservices,shopping") {
        //         return "rgba(222, 109, 80," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "nightlife") {
        //         return "rgba(0, 204, 102," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "financialservices,professional") {
        //         return "rgba(153, 153, 102," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "health") {
        //         return "rgba(153, 153, 102," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "civic") {
        //         return "rgba(0, 138, 230," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else {
        //         return "rgba(0,0,0,0)";
        //     }
        // })
        circles.style("stroke-width", 1);
        // circles.style("stroke", function (d) {
        //     if (d.properties.metacategory == "restaurants") {
        //         return "rgba(210, 84, 249," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "grocery") {
        //         return "rgba(252,255,0," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "active") {
        //         return "rgba(255, 160, 19," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "localservices,shopping") {
        //         return "rgba(255, 71, 25," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "nightlife") {
        //         return "rgba(0, 204, 102," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "financialservices,professional") {
        //         return "rgba(153, 153, 102," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "health") {
        //         return "rgba(153, 153, 102," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else if (d.properties.metacategory == "civic") {
        //         return "rgba(0, 138, 230," + (Math.sqrt(oScale(d.properties.reviews) * 0.4)) + ")";
        //     }
        //     else {
        //         return "rgba(0,0,0,0)";
        //     }
        // })
    }

    // showCircles();
    circles.on("mouseover", function (d) {


        $("#places-info").clearQueue();
        $("#places-info").stop();

        $("#places-info").animate({
            opacity: 1
        }, 500)
        var circle = d3.select(this);
        circle.transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .style("cursor", "pointer")
            .attr("r", function (d) {
                if (d.properties.reviews > 10) {
                    return Math.sqrt(parseInt(d.properties.reviews) * 2);
                }
                else if (d.properties.reviews > 50) {
                    return Math.sqrt(parseInt(d.properties.reviews) * .5);
                }
                else {
                    return 10;
                }

            });
        var data = circle.datum();
        nameText.text(data.properties.name)
            .attr("class", "nameshow")
            .attr("x", 150)
            .attr("y", 25)
            .style("font-size", "120%");


        reviewsText
            .text(data.properties.location.address1)
            .attr("class", "nameshow")
            .attr("x", 150)
            .attr("y", 40)
            .style("font-size", "80%");


        // var bbox = nameText[0].getBBox();
        // placeInfoSvg.attr("width", function () {
        //     if (bbox.width < 300) {
        //         return 300;
        //     }
        //     else {
        //         nameText.attr("transform", "translate(" + ((bbox.width / 2) - 150) + ",0)");
        //         reviewsText.attr("transform", "translate(" + ((bbox.width / 2) - 150) + ",0)");
        //         return (bbox.width);
        //     }
        // });


    });
    circles.on("mouseout", function () {

        $("#places-info").animate({
            opacity: 0
        }, 250)
        //Remove the tooltip
        nameText
            .attr("class", "tooltiphide");
        reviewsText
            .attr("class", "tooltiphide");
        d3.select(this)
            .transition()
            .duration(500)
            .attr("r", function (d) {
                if (d.properties.reviews > 10) {
                    return Math.sqrt(parseInt(d.properties.reviews) * 0.15);
                }
                else if (d.properties.reviews > 50) {
                    return Math.sqrt(parseInt(d.properties.reviews) * .05);
                }
                else {
                    return 5;
                }
            })
    });

    var _points = pointData;


    function drawIsochrones(_stationName, callback) {
        var path = urlPath + "/data/station-isochrones/" + _stationName + ".json";
        isochroneGroups[_stationName] = isochronesG.append("g").attr("id", _stationName);
        d3.json(path, function (error, json) {
            var geojson = json.features;
            _polygon = geojson;
            var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform);
            var geojsonPoint = isochroneGroups[_stationName].selectAll("path")
                .data(geojson)
                .enter().append("path").attr("class", function (d) {
                    return "min-" + d.properties.minutes + "-" + _stationName.replace(/\s+/g, '') + " geojson-hide";
                });
            // map.on("viewreset", reset);
            polygonsUpdate();

            // Use Leaflet to implement a D3 geometric transformation.
            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }

            map.on("viewreset", polygonsUpdate);
            function polygonsUpdate() {
                var bounds = path.bounds(geojson),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];
                geojsonPoint.attr("d", path);
            }

            if (callback) {
                callback()
            }
            ;
        })

    }

    function compareData(feature,status) {

        _totalPlaces = 0,
            _totalreviews = 0,
            _totalGrocery = 0,
            _totalBars = 0,
            _totalRestaurants = 0,
            _totalCivic = 0,
            _totalActive = 0,
            _totalShopping = 0,
            _totalProfessionalServices = 0;

        function testCircles() {
            circles.attr("class", function (d, i) {
                var businessType = d3.select(this).attr("businessType");
                if (turf.inside(d, feature)) {

                    // circles.attr("fill", "black");
                    calculateTotals(d);
                    var currentId = parseInt(d3.select(this).attr("id"));
                    d3.select(this).attr("id", function () {
                        return currentId + 1;
                    });
                    return businessType + " on selected";
                }
                else {
                    d3.select(this).attr("id", 0);
                    return businessType;
                }
            })
        }

        testCircles();
        updateBars();

        function slide() {
            var onePath = d3.select(this);
            var counter = parseInt(onePath.attr("id"));
            if (counter == 1) {
                onePath.style("stroke-opacity", 1)
                    .transition()
                    .duration(500)
                    .delay(function (d, i) {
                        return i * 5.25;
                    })
                    .attr("stroke", "white")
                    .style("stroke-width", 7)
                    .style("stroke-opacity", 0)
                ;
            }
            else {
                return;
            }
            // function repeat() {
            //     onePath = onePath
            //         .transition()
            //         .duration(850)
            //         .attr("stroke","black")
            //         .style("stroke-width",20)
            //         .style("stroke-opacity",0)
            //     ;
            //     // .each("end", repeat);
            // })();
        }


    }

    function changeIsochrone() {

        var stationName = _stationName;
        _polygonClass = ".min-" + _distance + "-" + stationName.replace(/\s+/g, '');
        ;
        _testIsochrone = _polygon.filter(function (obj) {
            return obj.properties.minutes == parseInt(_distance);
        });

    }

    $(document).on('input', '#isochrone-slider', function () {
        var distance = $(this).val();

        _distance = distance;
        $(".distance").html(function () {
            return (distance > 9) ? distance + " min" : ' ' + distance + " min"
        });
        changeIsochrone();
        showIsochrone();
        compareData();
    });


    function showIsochrone() {
        d3.selectAll("path").classed("geojson-show", false);

        var geojsonPoint = d3.selectAll(_polygonClass).classed("geojson-show", true);
    }

    function calculateTotals(point) {

        _totalreviews += point.properties.reviews;
        if (point.properties.metacategory == "restaurants" && $("input[value='restaurants']").prop("checked")) {
            _totalPlaces += 1;
            _totalRestaurants += 1;
        }
        else if (point.properties.metacategory == "grocery" && $("input[value='grocery']").prop("checked")) {
            _totalPlaces += 1;
            _totalGrocery += 1;
        }
        else if (point.properties.metacategory == "nightlife" && $("input[value='nightlife']").prop("checked")) {
            _totalPlaces += 1;
            _totalBars += 1;
        }
        else if (point.properties.metacategory == "active" && $("input[value='active']").prop("checked")) {
            _totalPlaces += 1;
            _totalActive += 1;
        }
        else if (point.properties.metacategory == "financialservices,professional" && $("input[value='financialservices,professional']").prop("checked")) {
            _totalPlaces += 1;
            _totalProfessionalServices += 1;
        }
        else if (point.properties.metacategory == "localservices,shopping" && $("input[value='localservices,shopping']").prop("checked")) {
            _totalPlaces += 1;
            _totalShopping += 1;
        }
        else {
        }

    }



    function showCircles(callback,param1) {




        function processEachLayer() {
            var yelpmetacategory = d3.selectAll("circle");
            yelpmetacategory.each(function (d) {
                cat = d.properties.metacategory;
                if (turnedOn.indexOf(cat) !== -1) {
                    d3.select(this).style("display", "initial");
                    d3.select(this).classed("on", true)
                }
                else {
                    d3.select(this).classed("on", false)
                    d3.select(this).style("display", "none");
                }
            });

        }

        if (_clickedItem.value == "toggle") {
            var checkboxesYelp = document.getElementsByClassName('checkbox-yelp');
            var turnedOn = [];
            var turnedOnIso = [];
            $(".checkbox-yelp").prop('checked', $('.toggle').prop("checked"));
            for (var i = 0; i < checkboxesYelp.length; i++) {
                if (checkboxesYelp[i].checked) turnedOn.push(checkboxesYelp[i].value);
            }
            processEachLayer();
        }
        else {
            var checkboxesYelp = document.getElementsByClassName('checkbox-yelp');
            var turnedOn = [];
            for (var i = 0; i < checkboxesYelp.length; i++) {
                if (checkboxesYelp[i].checked) turnedOn.push(checkboxesYelp[i].value);
            }
            processEachLayer();
        }


        if (callback) {
            callback(param1);
        }
        // compareData();
    }


    $(".strategies").on("change",function () {
        var clickedItem = {
            "value": this.value,
            "status": this.checked
        };

        console.log(clickedItem.value);
        _clickedItem = clickedItem;

        $("#help-div").hide();
        $("#help-div").html($(".strategies option:selected").html());
        $("#help-div").fadeIn(1000);
        showCirclesStrategies();
        // showCircles(compareData,_activeFeature);


    });

    function showCirclesStrategies() {
        d3.selectAll("circle").classed("off",true).classed("on",false);
        var selected = d3.selectAll("circle").filter(function(d) {
            return d.properties.metacategory == _clickedItem.value
        })
        selected.classed("on",true).classed("off",false);
    }


    // var drawnItems = new L.FeatureGroup();
    // map.addLayer(drawnItems);
    //
    // var drawControl = new L.Control.Draw({
    //     edit: {
    //         featureGroup: drawnItems
    //     }
    // });
    // map.addControl(drawControl);
    //
    // map.on('draw:created', function (e) {
    //     var type = e.layerType,
    //         layer = e.layer;
    //     drawnItems.addLayer(layer);
    // });

}


