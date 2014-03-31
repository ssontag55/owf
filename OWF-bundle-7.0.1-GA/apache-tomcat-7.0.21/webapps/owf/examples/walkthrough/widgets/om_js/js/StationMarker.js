L.StationMarker = L.CircleMarker.extend({
    _openPopup: function (e) {
		this._popup.setLatLng(e.latlng);
		this._map.openPopup(this._popup);
		mapView.get_latest_profile(this.feature.id);
	}
});
