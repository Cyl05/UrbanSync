import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents,
} from "react-leaflet";
import MapClickHandler from "../features/MapClickHandler";

const sampleIssues = [
	{
		id: 1,
		lat: 12.97615,
		lng: 77.60387,
		title: "Pothole",
		description: "Large pothole on main road",
	},
	{
		id: 2,
		lat: 12.98277,
		lng: 77.61964,
		title: "Flood",
		description: "Area full flooded",
	},
];

const Map = () => {
	const handleMapClick = (lat: number, lng: number) => {
		console.log(`Clicked at: Lat ${lat}, Lng ${lng}`);
	};

	return (
		<MapContainer
			center={[12.97914, 77.61112]}
			zoom={16}
			style={{ height: "100vh", width: "100vw" }}
			scrollWheelZoom={true}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
			/>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
			/>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
			/>
			<MapClickHandler onClick={handleMapClick} />
			{sampleIssues.map((issue) => (
				<Marker key={issue.id} position={[issue.lat, issue.lng]}>
					<Popup>
						<strong>{issue.title}</strong>
						<br />
						{issue.description}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default Map;
