import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapClickHandler from "../features/MapClickHandler";
import { IssueCard } from "../features/IssueCard";
import type { Issue } from '../types/issue';

const sampleIssues: Issue[] = [
	{
		id: 1,
		lat: 12.97615,
		lng: 77.60387,
		title: "Pothole",
		description: "Large pothole on main road",
        imgUrl: 'https://media.newyorker.com/photos/62e9890ed845dffa5de16b9a/master/pass/Keeley-Sinkhole-1_1.jpg'
	},
	{
		id: 2,
		lat: 12.98277,
		lng: 77.61964,
		title: "Flood",
		description: "Area full flooded",
        imgUrl: 'https://i.redd.it/ulsoor-lake-good-morning-bengaluru-v0-rrw6izuon9991.jpg?width=4032&format=pjpg&auto=webp&s=ec36772165e936208a2e1d23a01b0cef4d7f5ab3'
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
			{sampleIssues.map((issue: Issue) => (
				<Marker key={issue.id} position={[issue.lat, issue.lng]}>
					<Popup>
						<IssueCard issue={issue} />
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default Map;