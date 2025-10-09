import React, { useState } from "react";
import { FaTimes, FaMapMarkerAlt } from "react-icons/fa";

interface NewIssueFormData {
	title: string;
	description?: string;
	address: string;
	photo_url?: string;
}

interface NewIssueSidebarProps {
	isDisplayed: boolean;
	onClose: () => void;
}

const NewIssueSidebar: React.FC<NewIssueSidebarProps> = ({ isDisplayed, onClose }) => {
	const [formData, setFormData] = useState<NewIssueFormData>({
		title: "",
		description: "",
		address: "",
		photo_url: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitting issue:", formData);
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
						<h2 className="text-xl font-bold text-gray-900">Report New Issue</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
							aria-label="Close sidebar"
						>
							<FaTimes className="h-5 w-5" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
						<div>
							<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
							<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
							<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
								Address <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<FaMapMarkerAlt className="absolute left-3 top-1/3 transform  text-gray-400" />
								<input
									type="text"
									id="address"
									name="address"
									value={formData.address}
									onChange={handleInputChange}
									required
									placeholder="Enter location address"
									className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="photo_url" className="block text-sm font-medium text-gray-700 mb-1">
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
								<p className="text-sm font-medium text-gray-700 mb-2">Photo Preview:</p>
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
						<div className="flex space-x-3">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="submit"
								onClick={handleSubmit}
								className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
							>
								Submit Issue
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewIssueSidebar;
