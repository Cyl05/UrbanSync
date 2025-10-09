import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	ZoomControl,
	useMap,
} from "react-leaflet";
import MapClickHandler from "./MapClickHandler";
import MapHeader from "./MapHeader";
import { IssueCard } from "./IssueCard";
import CenterMarker from "./CenterMarker";
import MapCenterTracker from "./MapCenterTracker";
import type { IssueMini } from "../types/schema";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useState, useCallback, useRef } from "react";

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
		}
	}
`;

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

	const handleMapClick = (lat: number, lng: number) => {
		console.log(`Clicked at: Lat ${lat}, Lng ${lng}`);
	};

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

	const handleMapCenterChange = useCallback((lat: number, lng: number) => {
		if (!isProgrammaticMove.current) {
			setCenterCoords({
				latitude: lat,
				longitude: lng,
			});
		}
	}, []);

	const { data, loading, error } = useQuery<GetIssuesData>(GET_ISSUES);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
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
					{!isMapPinMode && (
						<RecenterMap
							latitude={centerCoords.latitude}
							longitude={centerCoords.longitude}
						/>
					)}
					{displaySidebar === false && (
						<ZoomControl position="bottomright" />
					)}
					{displaySidebar && isMapPinMode && (
						<MapCenterTracker onCenterChange={handleMapCenterChange} />
					)}
					<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
					<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
					<TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}" />
					<MapClickHandler onClick={handleMapClick} />
					{data?.issues?.map((issue: IssueMini) => (
						<Marker
							key={issue.id}
							position={[issue.latitude, issue.longitude]}
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
