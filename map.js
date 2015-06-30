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
        var mapnik = new OpenLayers.Layer.OSM();
        /*var mapnik = new OpenLayers.Layer.OSM("OpenCycleMap",
         ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
         "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
         "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]);*/
        this.map.addLayer(mapnik);

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
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(point.x,point.y),icon));
        var newPoint = 'POINT('+point.x+' '+point.y+')';
        this.notify('POINT',newPoint);
    },

    notify : function(title, errorMsgPopup){
        var boxTitle = (title) ? title : 'Message';

        $("#msgBoxTitle").html(boxTitle);
        $("#errorMsg").html(errorMsgPopup);
        $("#errorMsgDiv").show(50);
    }
};
