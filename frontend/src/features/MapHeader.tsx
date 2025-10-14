import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { TbMapPinExclamation } from "react-icons/tb";
import NewIssueSidebar from "./NewIssueSidebar";

interface MapHeaderProps {
	displaySidebar: boolean;
	setDisplaySidebar: (value: boolean | ((prev: boolean) => boolean)) => void;
	handlePlaceSelect: (place: {
		properties: {
			formatted?: string;
			address_line1?: string;
			lat: number;
			lon: number;
		};
	}) => void;
	isMapPinMode: boolean;
	setIsMapPinMode: (value: boolean) => void;
	mapCenterCoords: {
		latitude: number;
		longitude: number;
	};
}

const MapHeader: React.FC<MapHeaderProps> = ({
	displaySidebar,
	setDisplaySidebar,
	handlePlaceSelect,
	isMapPinMode,
	setIsMapPinMode,
	mapCenterCoords
}) => {
	const { isAuthenticated } = useAuth();

	return (
		<div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center">
			<div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
				<FaMapMarkerAlt className="h-5 w-5 text-indigo-600" />
				<h1 className="text-lg font-bold text-gray-900">UrbanSync</h1>
			</div>

			<div className="flex space-x-2">
				{isAuthenticated ? (
					<>
						<Link
							to="/profile"
							className="bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium"
						>
							<FaUser />
							<span>Profile</span>
						</Link>
						<button
							className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium cursor-pointer"
							onClick={() => setDisplaySidebar((prev) => !prev)}
						>
							<TbMapPinExclamation />
							<span>New Issue</span>
						</button>
					</>
				) : (
					<Link
						to="/login"
						className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium"
					>
						<FaUserPlus className="h-4 w-4" />
						<span>Login</span>
					</Link>
				)}
			</div>
			<NewIssueSidebar
				isDisplayed={displaySidebar}
				onClose={() => setDisplaySidebar(false)}
				handlePlaceSelect={handlePlaceSelect}
				isMapPinMode={isMapPinMode}
				setIsMapPinMode={setIsMapPinMode}
				mapCenterCoords={mapCenterCoords}
			/>
		</div>
	);
};

export default MapHeader;
