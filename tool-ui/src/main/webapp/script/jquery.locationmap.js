/** Map plugin for Location fields. */
(function($, win, undef) {

var doc = win.document,
        $win = $(win);

$.plugin2('locationMap', {
    '_create': function(locationMap) {
        var plugin = this;

        var map = L.map(locationMap);
        new L.TileLayer.MapQuestOpenOSM().addTo(map);

        var latInput = $(locationMap).find(".location-map-lat");
        var longInput = $(locationMap).find(".location-map-long");
        var zoomInput = $(locationMap).find(".location-map-zoom");

        var lat = $(latInput).val();
        var lng = $(longInput).val();
        var zoom = $(zoomInput).val();

        if (lat === null || lng === null) {
            lat = 39.8282;
            lng = -98.5795;
        }

        map.setView([lat, lng], zoom);

        map.on('zoomend', function(e) {
            zoomInput.val(map.getZoom());
        });

        var marker = null;
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', function(e) {
            plugin.updateLatLng(e.target, map, latInput, longInput, zoomInput);
        });

        new L.Control.GeoSearch({
            zoomLevel: 16,
            provider: new L.GeoSearch.Provider.OpenStreetMap(),
            success: function(m) {
                if (marker !== null && m !== marker) {
                    map.removeLayer(marker);
                }

                marker = m;
                marker.dragging.enable();

                marker.on('dragend', function(e) {
                    plugin.updateLatLng(e.target, map, latInput, longInput, zoomInput);
                });

                plugin.updateLatLng(marker, map, latInput, longInput, zoomInput);
            }
        }).addTo(map);
         
    },

    'updateLatLng' : function(marker, map, latInput, longInput, zoomInput) {
        var latlong = marker.getLatLng();
        latInput.val(latlong.lat);
        longInput.val(latlong.lng);
        zoomInput.val(map.getZoom());
    }
});

}(jQuery, window));

