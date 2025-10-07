import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapClickHandler from "./MapClickHandler";
import MapHeader from "./MapHeader";
import { IssueCard } from "./IssueCard";
import type { IssueMini } from "../types/schema";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

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

const Map = () => {
	const handleMapClick = (lat: number, lng: number) => {
		console.log(`Clicked at: Lat ${lat}, Lng ${lng}`);
	};

	const { data, loading, error } = useQuery<GetIssuesData>(GET_ISSUES);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (data) {
		return (
			<div className="relative overflow-hidden">
				<MapHeader />
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
				</MapContainer>
			</div>
		);
	}
};

export default Map;
