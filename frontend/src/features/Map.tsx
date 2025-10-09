import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import MapClickHandler from "./MapClickHandler";
import MapHeader from "./MapHeader";
import { IssueCard } from "./IssueCard";
import type { IssueMini } from "../types/schema";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

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
	const [displaySidebar, setDisplaySidebar] = useState(false);
	const handleMapClick = (lat: number, lng: number) => {
		console.log(`Clicked at: Lat ${lat}, Lng ${lng}`);
	};

	const { data, loading, error } = useQuery<GetIssuesData>(GET_ISSUES);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (data) {
		return (
			<div className="relative overflow-hidden">
				<MapHeader displaySidebar={displaySidebar} setDisplaySidebar={setDisplaySidebar} />
				<MapContainer
					center={[12.97914, 77.61112]}
					zoom={16}
					style={{ height: "100vh", width: "100vw" }}
					scrollWheelZoom={true}
					zoomControl={false}
					className="cursor-pointer"
				>
					{displaySidebar === false  && <ZoomControl position="bottomright" />}
					<TileLayer
						url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
					/>
					<TileLayer
						url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
					/>
					<TileLayer
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
