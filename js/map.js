/**
 * Created by Arslan on 6/27/2015.
 */


OL = {
    map : null,
    init : function() {
        this.buildMap();
    },

    buildMap : function() {
        this.map = new OpenLayers.Map("map");

        // Add Controls
        //this.map = new OpenLayers.Map('map', { controls: [] });
        //this.map.addControl(new OpenLayers.Control.Navigation());
        this.map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));
        var OSM = new OpenLayers.Layer.OSM();
        var OpenCycleMap = new OpenLayers.Layer.OSM("OpenCycleMap",
         ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
         "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
         "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]);
        var gPhysical = new OpenLayers.Layer.Google(
            "Google Physical",
            {type: google.maps.MapTypeId.TERRAIN}
        );
        var gStreets =     new OpenLayers.Layer.Google(
                "Google Streets", // the default
                {numZoomLevels: 20}
            );
        var gHybrid =     new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
            );
        var gSatellite =     new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            );

        /*MapBOX*/
        var earth = new OpenLayers.Layer.XYZ(
            "Natural Earth",
            [
                "http://a.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                "http://b.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                "http://c.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                "http://d.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png"
            ], {
                attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a>",
                sphericalMercator: true,
                wrapDateLine: true,
                numZoomLevels: 5
            }
        );
        this.map.addLayers([OSM,OpenCycleMap,gPhysical,gStreets,gHybrid,gSatellite, earth]);

        var lonlat = new OpenLayers.LonLat(-74.45516, 40.84943).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:3857") // to Spherical Mercator
        );

        var zoom = 15;
        this.map.setCenter(lonlat, zoom);

        // Style map for route
        var routeStyleMap = new OpenLayers.StyleMap({
            strokeColor: "#0000FF",
            strokeWidth: 4,
            strokeDashstyle: "dash",
            strokeOpacity: 0.7,
            fill: "#0000FF",
            fillOpacity: 0.2
        });

        // create a lookup table with different symbolizers for 0, 1 and 2
        var lookup = {
            0: {strokeColor: "#0000FF", strokeWidth: 7},
            1: {strokeColor: "#FF0000", strokeWidth: 5},
            2: {strokeColor: "#000000", strokeWidth: 5},
            3: {strokeColor: "#FFFF00", strokeWidth: 5}
        };

        // add rules from the above lookup table, with the keyes mapped to
        // the "type" property of the features, for the "default" intent
        routeStyleMap.addUniqueValueRules("default", "type", lookup);

        // Vector layer to draw route
        this.vectorLayer = new OpenLayers.Layer.Vector("Route",{projection:"EPSG:3857", styleMap: routeStyleMap});
        this.map.addLayer(this.vectorLayer);

        markers = new OpenLayers.Layer.Markers( "Markers" );
        this.map.addLayer(markers);
    },

    drawLonLat : function(){
        var lon = $('#lon').val();
        var lat = $('#lat').val();
        var sp = $('#projection').val();
        var sourceProj = new OpenLayers.Projection("EPSG:"+sp, {});

        if(sp == '3857')
            this.drawMarkers(lon,lat,sourceProj,true);
        else
            this.drawMarkers(lon,lat,sourceProj,false);
    },

    drawMarkers : function(lon, lat, sourceProjection, sameProjection){
        var point = new OpenLayers.Geometry.Point(lon , lat);
        var destProjection = new OpenLayers.Projection("EPSG:3857", {});
        if(sameProjection == false)
            point = new OpenLayers.Projection.transform(point, sourceProjection, destProjection);

        var markers = new OpenLayers.Layer.Markers( "Markers" );
        this.map.addLayer(markers);

        var size = new OpenLayers.Size(45,63);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon('ol/img/blue-marker.png', size, offset);
        var lonLat = new OpenLayers.LonLat(point.x,point.y);
        markers.addMarker(new OpenLayers.Marker(lonLat,icon));

        this.map.panTo(lonLat);

        var newPoint = 'POINT('+point.x+' '+point.y+')';
        this.notify('POINT',newPoint);
    },

    drawLinestring : function(){
        var lon = $('#lon').val();
        var lat = $('#lat').val();
        var sp = $('#projection').val();
        var sourceProj = new OpenLayers.Projection("EPSG:"+sp, {});
        var lineString= $('#d-linestring').val();
        var linecolors= [0,1,2,3];

        var parser;
        if(sp == '3857'){
            parser = new OpenLayers.Format.WKT();
        }else{
            parser = new OpenLayers.Format.WKT({externalProjection: sourceProj, internalProjection: this.map.getProjectionObject()});
        }

        var lineFeat = parser.read(lineString);
        lineFeat.attributes.type = linecolors[0];
        this.vectorLayer.addFeatures(lineFeat);
        this.map.zoomToExtent(this.vectorLayer.getDataExtent());


    },

    notify : function(title, msg){
        //var boxTitle = (title) ? title : 'Message';
        //$('.panel-title').html(boxTitle);
        //$('.panel-body').html(msg);
        $('.alert-success').html(msg).show();
    },

    drawLocation : function () {
        let self = this,
            fields = {
                api_key: this.apiKey,
                vehicle: $('#vehicle').val(),
                dateFrom: $('#from-date').data('date'),
                dateTo: $('#to-date').data('date')
            };

        // Reset
        OL.vectorLayer.removeAllFeatures();

        $.get("https://v1jc1ohvc3.execute-api.us-east-1.amazonaws.com/dev/positions", fields, function(response, status){
            let lineString = response.body;
            self.drawNovaLinestring(lineString);
            console.log(lineString);
        }).fail(function(jqXHR, status, error) {
            console.log( "error" );
        })
            .always(function() {
                // Loading
                $('.loading').hide();
                console.log( "finished" );
            });
    },

    draw : function() {
        // Loading
        $('.loading').show();

        // Draw markers
        this.drawLocationMarker();

        // Draw Linestring
        this.drawLocation()
    },

    drawLocationMarker : function() {
        let self = this,
            fields = {
                api_key: this.apiKey,
                vehicle: $('#vehicle').val(),
                dateFrom: $('#from-date').data('date'),
                dateTo: $('#to-date').data('date')
            };

        // Reset
        markers.clearMarkers();

        $.get("https://v1jc1ohvc3.execute-api.us-east-1.amazonaws.com/dev/locations", fields, function(response, status){
            let data = response.positions;

            if(data.length > 0){
                data.forEach(function(loc) {
                    self.drawMarkersNova(loc);
                });
            }
            // console.log(lineString);
        }).fail(function(jqXHR, status, error) {
            console.log( "error" );
        })
            .always(function() {
                console.log( "finished" );
            });
    },

    drawNovaLinestring : function(lineString){

        let sourceProj = new OpenLayers.Projection("EPSG:4326", {}),
            linecolors= [0,1,2,3],
            parser;

        parser = new OpenLayers.Format.WKT({externalProjection: sourceProj, internalProjection: this.map.getProjectionObject()});

        let lineFeat = parser.read(lineString);
        lineFeat.attributes.type = linecolors[0];
        this.vectorLayer.addFeatures(lineFeat);
        this.map.zoomToExtent(this.vectorLayer.getDataExtent());


    },

    drawMarkersNova : function(location){
        let self = this, sourceProjection = new OpenLayers.Projection("EPSG:4326", {}),
            point = new OpenLayers.Geometry.Point(location['lng'], location['lat']),
            destProjection = new OpenLayers.Projection("EPSG:3857", {});

        point = new OpenLayers.Projection.transform(point, sourceProjection, destProjection);


        let size = new OpenLayers.Size(45,63),
            offset = new OpenLayers.Pixel(-(size.w/2), -size.h),
            icon = new OpenLayers.Icon('ol/img/blue-marker.png', size, offset),
            lonLat = new OpenLayers.LonLat(point.x,point.y),
            marker = new OpenLayers.Marker(lonLat,icon);
        marker.data = location;


        markers.addMarker(marker);

        marker.events.register("click", marker, function(e){
            let html = '';
            html = '<h3>Vehicle detail:</h3>';
            html += '<table class="table">';
            html += '<tr><th scope="col">vehicleId</th><td>'+marker['data'].vehicleId+'</td></tr>';
            html += '<tr><th scope="col">GPS DateTime</th><td>'+marker['data'].gpsDateTime+'</td></tr>';
            html += '<tr><th scope="col">lat</th><td>'+marker['data'].lat+'</td></tr>';
            html += '<tr><th scope="col">lng</th><td>'+marker['data'].lng+'</td></tr>';
            html += '<tr><th scope="col">speedKPH</th><td>'+marker['data'].speedKPH+'</td></tr>';
            html += '</table>';

            popup = new OpenLayers.Popup.FramedCloud("vehicle-popup",
                marker.lonlat,
                new OpenLayers.Size(200, 200),
                html,
                null, true);

            self.map.addPopup(popup);
        });

        this.map.panTo(lonLat);
    }

};
