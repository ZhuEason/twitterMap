$(document).ready(initMap);


var data;
var map;
var chicago = {lat: 41.85, lng: -87.65};
var markers = [];

var negative = {
    url: "../imag/aIW9z2-1.jpg", // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};

var positive = {
    url: "../imag/smiley-laugh.png", // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};

function CenterControl(controlDiv, map, center) {
    // We set up a variable for this since we're adding event listeners
    // later.
    var control = this;

    // Set the center property upon construction
    control.center_ = center;
    controlDiv.style.clear = 'both';

    // Set CSS for the control border
    var goCenterUI = document.createElement('div');
    goCenterUI.id = 'goCenterUI';
    goCenterUI.title = 'Click to recenter the map';
    controlDiv.appendChild(goCenterUI);

    // Set CSS for the control interior
    var goCenterText = document.createElement('div');
    goCenterText.id = 'goCenterText';
    goCenterText.innerHTML = 'Center Map';
    goCenterUI.appendChild(goCenterText);

    // Set CSS for the setCenter control border
    var setCenterUI = document.createElement('div');
    setCenterUI.id = 'setCenterUI';
    setCenterUI.title = 'Click to change the center of the map';
    controlDiv.appendChild(setCenterUI);

    // Set CSS for the control interior
    var setCenterText = document.createElement('div');
    setCenterText.id = 'setCenterText';
    setCenterText.innerHTML = 'Set Center';
    setCenterUI.appendChild(setCenterText);

    // Set up the click event listener for 'Center Map': Set the center of
    // the map
    // to the current center of the control.
    goCenterUI.addEventListener('click', function () {
        var currentCenter = control.getCenter();
        map.setCenter(currentCenter);
    });

    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    setCenterUI.addEventListener('click', function () {
        var newCenter = map.getCenter();
        control.setCenter(newCenter);
    });

}

/**
 * Define a property to hold the center state.
 * @private
 */
CenterControl.prototype.center_ = null;

/**
 * Gets the map center.
 * @return {?google.maps.LatLng}
 */
CenterControl.prototype.getCenter = function () {
    return this.center_;
};

/**
 * Sets the map center.
 * @param {?google.maps.LatLng} center
 */
CenterControl.prototype.setCenter = function (center) {
    this.center_ = center;
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: chicago,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    google.maps.event.addListener(map, 'click', function (event) {
        addMarker(event.latLng, map);
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map, chicago);

    centerControlDiv.index = 1;
    centerControlDiv.style['padding-top'] = '10px';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    $("button").click(function () {
        deleteMarkers();
        var word = $('#keywords').val();
        $.post("/data", {keyword:word}, function (responseTxt, statusTxt, xhr) {
            for (i = 0; i < responseTxt.hits.hits.length; i++) {
                obj = JSON.parse(responseTxt.hits.hits[i]._source.text);
                point = new google.maps.LatLng(
                    obj.geo.coordinates[0],
                    obj.geo.coordinates[1]);
                addFeature(point,positive,map);
            }
            //console.log(hits.hits[0]._source.geo.coordinates);
        })
    });
    //callback();
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}



function addFeature(location, icon_feature, map) {
    console.log("hello");
    var marker = new google.maps.Marker({
        position: location,
        icon: icon_feature,
        map: map
    });
    markers.push(marker);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}