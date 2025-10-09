import { useMapEvents } from "react-leaflet";
import { useEffect, useRef } from "react";

interface MapCenterTrackerProps {
	onCenterChange: (lat: number, lng: number) => void;
}

const MapCenterTracker: React.FC<MapCenterTrackerProps> = ({ onCenterChange }) => {
	const hasReportedInitial = useRef(false);
	
	const map = useMapEvents({
		move: () => {
			const center = map.getCenter();
			onCenterChange(center.lat, center.lng);
		},
		zoomend: () => {
			const center = map.getCenter();
			onCenterChange(center.lat, center.lng);
		},
	});

	// Report initial center only once
	useEffect(() => {
		if (!hasReportedInitial.current) {
			const center = map.getCenter();
			onCenterChange(center.lat, center.lng);
			hasReportedInitial.current = true;
		}
	}, [map, onCenterChange]);

	return null;
};

export default MapCenterTracker;
