import React, { useState } from "react";
import { FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import {
	GeoapifyGeocoderAutocomplete,
	GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../hooks/useAuth";

const CREATE_ISSUE = gql`
	mutation CreateIssue(
		$title: String!
		$description: String
		$status: issue_status!
		$latitude: numeric!
		$longitude: numeric!
		$photo_url: String
		$created_by: uuid!
	) {
		insert_issues_one(
			object: {
				title: $title
				description: $description
				status: $status
				latitude: $latitude
				longitude: $longitude
				photo_url: $photo_url
				created_by: $created_by
			}
		) {
			id
			title
			description
			status
			latitude
			longitude
			photo_url
			created_by
			created_at
		}
	}
`;

interface NewIssueSidebarProps {
	isDisplayed: boolean;
	onClose: () => void;
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

const NewIssueSidebar: React.FC<NewIssueSidebarProps> = ({
	isDisplayed, 
	onClose, 
	handlePlaceSelect,
	isMapPinMode,
	setIsMapPinMode,
	mapCenterCoords
}) => {
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		address: "",
		photo_url: "",
	});

	const [createIssue, { loading, error }] = useMutation(CREATE_ISSUE, {
		refetchQueries: ['getIssues'],
		onCompleted: () => {
			setFormData({
				title: "",
				description: "",
				address: "",
				photo_url: "",
			});
			onClose();
		},
		onError: (err: Error) => {
			console.error("Error creating issue:", err);
		}
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!user?.id) {
			alert("You must be logged in to report an issue");
			return;
		}

		if (!formData.title.trim()) {
			alert("Please provide a title for the issue");
			return;
		}

		if (!mapCenterCoords.latitude || !mapCenterCoords.longitude) {
			alert("Please select a location for the issue");
			return;
		}

		try {
			await createIssue({
				variables: {
					title: formData.title,
					description: formData.description || null,
					status: "new",
					latitude: mapCenterCoords.latitude,
					longitude: mapCenterCoords.longitude,
					photo_url: formData.photo_url || null,
					created_by: user.id
				}
			});
		} catch (err) {
			console.error("Failed to submit issue:", err);
		}
	};

	return (
		<>
			<div
				className={`fixed top-0 right-0 h-full sm:w-96 bg-white shadow-2xl z-100 transform transition-transform duration-300 ease-in-out ${
					isDisplayed ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-900">
							Report New Issue
						</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
							aria-label="Close sidebar"
						>
							<FaTimes className="h-5 w-5" />
						</button>
					</div>

					<form
						onSubmit={handleSubmit}
						className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
					>
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Title <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								required
								placeholder="Brief description of the issue"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Description
							</label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={4}
								placeholder="Provide additional details about the issue"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Location <span className="text-red-500">*</span>
							</label>
							
							<div className="flex space-x-2 mb-3">
								<button
									type="button"
									onClick={() => setIsMapPinMode(false)}
									className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
										!isMapPinMode
											? "bg-indigo-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									Search Address
								</button>
								<button
									type="button"
									onClick={() => setIsMapPinMode(true)}
									className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer ${
										isMapPinMode
											? "bg-indigo-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									<FaMapMarkerAlt className="h-3 w-3" />
									<span>Pin on Map</span>
								</button>
							</div>

							{!isMapPinMode ? (
								<div className="relative">
									<GeoapifyContext apiKey="bba4fdf685444f61829c226b09ff6aa0">
										<GeoapifyGeocoderAutocomplete
											placeholder="Enter address here"
											value={formData.address}
											limit={5}
											debounceDelay={300}
											placeSelect={(place) => {
												setFormData((prev) => ({
													...prev,
													address: place.properties.formatted || "",
												}));
												handlePlaceSelect(place);
											}}
										/>
									</GeoapifyContext>
								</div>
							) : (
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
									<p className="text-sm text-blue-800 font-medium">
										Pan the map to position the marker
									</p>
									<div className="text-xs text-gray-600 space-y-1">
										<div className="flex justify-between">
											<span className="font-medium">Latitude:</span>
											<span className="font-mono">{mapCenterCoords.latitude.toFixed(6)}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">Longitude:</span>
											<span className="font-mono">{mapCenterCoords.longitude.toFixed(6)}</span>
										</div>
									</div>
								</div>
							)}
						</div>

						<div>
							<label
								htmlFor="photo_url"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Photo URL
							</label>
							<div className="relative">
								<input
									type="url"
									id="photo_url"
									name="photo_url"
									value={formData.photo_url}
									onChange={handleInputChange}
									placeholder="https://example.com/photo.jpg"
									className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								/>
							</div>
						</div>

						{formData.photo_url && (
							<div className="mt-2">
								<p className="text-sm font-medium text-gray-700 mb-2">
									Photo Preview:
								</p>
								<img
									src={formData.photo_url}
									alt="Issue preview"
									className="w-full h-48 object-cover rounded-lg border border-gray-300"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
							</div>
						)}
					</form>

					<div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
						{error && (
							<div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-800">
									Error: {error.message}
								</p>
							</div>
						)}
						<div className="flex space-x-3">
							<button
								type="button"
								onClick={onClose}
								disabled={loading}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								type="submit"
								onClick={handleSubmit}
								disabled={loading}
								className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Submitting..." : "Submit Issue"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewIssueSidebar;
