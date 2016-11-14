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

        var lonlat = new OpenLayers.LonLat(-0.12811289635481413, 51.51127992638647).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:3857") // to Spherical Mercator
        );

        var zoom = 11;
        this.map.setCenter(lonlat, zoom);
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

    notify : function(title, msg){
        //var boxTitle = (title) ? title : 'Message';
        //$('.panel-title').html(boxTitle);
        //$('.panel-body').html(msg);
        $('.alert-success').html(msg).show();
    }
};