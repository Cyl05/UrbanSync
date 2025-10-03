// import React from "react";
import { useMapEvents } from "react-leaflet";

function MapClickHandler({onClick}: {onClick: (lat: number, lng: number) => void}) {
	useMapEvents({
		click(e) {
			const { lat, lng } = e.latlng;
			onClick(lat, lng);
		},
	});
	return null;
}

export default MapClickHandler;