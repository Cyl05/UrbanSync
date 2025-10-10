import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	ZoomControl,
	useMap,
} from "react-leaflet";
import MapHeader from "./MapHeader";
import { IssueCard } from "./IssueCard";
import CenterMarker from "./CenterMarker";
import MapCenterTracker from "./MapCenterTracker";
import LoadingScreen from "../components/LoadingScreen";
import { type IssueMini } from "../types/schema";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useState, useRef } from "react";
import L from 'leaflet';
import { useNavigate } from "react-router-dom";

const GET_ISSUES = gql`
	query getIssues {
		issues {
			id
			title
			description
			latitude
			longitude
			photo_url
			status
			issue_type
		}
	}
`;

// Custom marker using DivIcon with img element (works reliably in production)
const customIcon = L.divIcon({
    html: `<img src="https://i.ibb.co/Kz834gDZ/image-removebg-preview-5-removebg-preview.png" style="width: 60px; height: 60px;" class="drop-shadow-lg" />`,
    className: 'custom-marker-icon',
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60]
});

type GetIssuesData = {
	issues: IssueMini[];
};

type coordsType = {
	latitude: number | undefined;
	longitude: number | undefined;
}

interface GeoapifyPlace {
	properties: {
		formatted?: string;
		address_line1?: string;
		lat: number;
		lon: number;
	};
}

const RecenterMap = ({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) => {
	const map = useMap();

	useEffect(() => {
		map.setView([latitude, longitude], map.getZoom(), {
			animate: true,
			duration: 1,
		});
	}, [latitude, longitude, map]);

	return null;
};

const Map = () => {
	const navigate = useNavigate();

	const [displaySidebar, setDisplaySidebar] = useState(false);
	const [centerCoords, setCenterCoords] = useState({
		latitude: 12.97914,
		longitude: 77.61112,
	});
	const [tempMarker, setTempMarker] = useState<coordsType>({
		latitude: undefined,
		longitude: undefined,
	});
	const [isMapPinMode, setIsMapPinMode] = useState(false);
	const isProgrammaticMove = useRef(false);

	const handlePlaceSelect = (value: GeoapifyPlace) => {
		if (value) {
			const { properties } = value;
			isProgrammaticMove.current = true;
			setCenterCoords({
				latitude: properties.lat,
				longitude: properties.lon,
			});
			setTempMarker({
				latitude: properties.lat,
				longitude: properties.lon
			});
			setTimeout(() => {
				isProgrammaticMove.current = false;
			}, 100);
		}
	};

	const handleMapCenterChange = (lat: number, lng: number) => {
		if (!isProgrammaticMove.current) {
			setCenterCoords({
				latitude: lat,
				longitude: lng,
			});
		}
	};

	const { data, loading, error } = useQuery<GetIssuesData>(GET_ISSUES);

	if (loading) return <LoadingScreen loadingText="Loading map and issues..." />;
	if (error) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
					<div className="text-red-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Map</h2>
					<p className="text-gray-600">{error.message}</p>
					{ error.message.startsWith("Malformed") ? (
							<button 
								onClick={() => navigate('/login')}
								className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition-colors duration-200 cursor-pointer mt-5"
							>
								Login
							</button>
						) : (
							<button
								onClick={() => window.location.reload()}
								className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
							>
								Reload Page
							</button>
						)
					}
				</div>
			</div>
		);
	}
	if (data) {
		return (
			<div className="relative overflow-hidden">
				<MapHeader
					displaySidebar={displaySidebar}
					setDisplaySidebar={setDisplaySidebar}
					handlePlaceSelect={handlePlaceSelect}
					isMapPinMode={isMapPinMode}
					setIsMapPinMode={setIsMapPinMode}
					mapCenterCoords={centerCoords}
				/>
				<MapContainer
					center={[12.97914, 77.61112]}
					zoom={16}
					style={{ height: "100vh", width: "100vw" }}
					scrollWheelZoom={true}
					zoomControl={false}
					className="cursor-pointer"
				>
					<RecenterMap
						latitude={centerCoords.latitude}
						longitude={centerCoords.longitude}
					/>
					{displaySidebar === false && (
						<ZoomControl position="bottomright" />
					)}
					{displaySidebar && isMapPinMode && (
						<MapCenterTracker onCenterChange={handleMapCenterChange} />
					)}
					<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
					<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
					<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}" />
					{data?.issues?.map((issue: IssueMini) => (
						<Marker
							key={issue.id}
							position={[issue.latitude, issue.longitude]}
							icon={customIcon}
						>
							<Popup>
								<IssueCard issue={issue} />
							</Popup>
						</Marker>
					))}

					{displaySidebar && !isMapPinMode && tempMarker.latitude && tempMarker.longitude && (
						<Marker
							position={[tempMarker.latitude, tempMarker.longitude]}
						/>
					)}
				</MapContainer>
				{displaySidebar && isMapPinMode && <CenterMarker />}
			</div>
		);
	}
};

export default Map;
