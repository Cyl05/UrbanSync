import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';
import { formatDate } from "../../utils/formatDate";
import { FaUser, FaEnvelope, FaCalendarAlt, FaBuilding, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import type { User } from "../../types/schema";

const UPDATE_USER_PROFILE = gql`
	mutation UpdateUserProfile($userId: uuid!, $name: String!, $profile_picture: String) {
		update_users_by_pk(
			pk_columns: { id: $userId }
			_set: { name: $name, profile_picture: $profile_picture }
		) {
			id
			name
			profile_picture
			email
			role
			created_at
			department {
				id
				name
				description
			}
		}
	}
`;

interface UserDetailsProps {
	stats: {
		new: number;
		inProgress: number;
		total: number;
		resolved: number;
	};
	user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({ stats, user }) => {
	const [inEditMode, setEditMode] = useState(false);
	const [editedName, setEditedName] = useState(user.name);
	const [editedProfilePicture, setEditedProfilePicture] = useState(user.profile_picture || "");
	const [saveError, setSaveError] = useState<string | null>(null);

	const [updateProfile, { loading: saving }] = useMutation(UPDATE_USER_PROFILE, {
		onCompleted: () => {
			setEditMode(false);
			setSaveError(null);
		},
		onError: (error) => {
			setSaveError(error.message);
		},
		refetchQueries: ['getUser'],
	});

	const handleSave = async () => {
		if (!editedName.trim()) {
			setSaveError("Name cannot be empty");
			return;
		}

		try {
			await updateProfile({
				variables: {
					userId: user.id,
					name: editedName.trim(),
					profile_picture: editedProfilePicture.trim() || null,
				},
			});
		} catch (err) {
			console.error("Error updating profile:", err);
		}
	};

	const handleCancel = () => {
		setEditedName(user.name);
		setEditedProfilePicture(user.profile_picture || "");
		setSaveError(null);
		setEditMode(false);
	};

	return (
		<div className="lg:col-span-1">
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="text-center mb-6 relative">
					{!inEditMode ? (
						<FaEdit 
							onClick={() => setEditMode(true)}
							className="text-gray-500 text-xl cursor-pointer hover:text-indigo-600 transition-colors absolute top-0 right-0"
							title="Edit Profile"
						/>
					) : (
						<div className="absolute top-0 right-0 flex space-x-2">
							<button
								onClick={handleSave}
								disabled={saving}
								className="text-white hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 bg-green-700 hover:bg-green-800 cursor-pointer p-2 rounded-md"
								title="Save Changes"
							>
								<FaSave className="text-xl" />
							</button>
							<button
								onClick={handleCancel}
								disabled={saving}
								className="text-white hover:text-gray-200 transition-colors duration-200 disabled:opacity-50 bg-red-700 hover:bg-red-800 cursor-pointer p-2 rounded-md"
								title="Cancel"
							>
								<FaTimes className="text-xl" />
							</button>
						</div>
					)}

					{inEditMode ? (
						<div className="space-y-4">
							<div>
								{editedProfilePicture ? (
									<img
										src={editedProfilePicture}
										alt="Profile preview"
										className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
										onError={(e) => {
											e.currentTarget.style.display = 'none';
											e.currentTarget.nextElementSibling?.classList.remove('hidden');
										}}
									/>
								) : null}
								<div className={`w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 ${editedProfilePicture ? 'hidden' : ''}`}>
									<FaUser className="text-indigo-600 text-4xl" />
								</div>
								<div className="max-w-sm mx-auto">
									<label htmlFor="profile-picture-url" className="block text-sm font-medium text-gray-700 mb-1">
										Profile Picture URL
									</label>
									<input
										id="profile-picture-url"
										type="url"
										value={editedProfilePicture}
										onChange={(e) => setEditedProfilePicture(e.target.value)}
										placeholder="https://example.com/photo.jpg"
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
									/>
								</div>
							</div>

							<div className="max-w-sm mx-auto">
								<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
									Name
								</label>
								<input
									id="name"
									type="text"
									value={editedName}
									onChange={(e) => setEditedName(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>

							{saveError && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
									{saveError}
								</div>
							)}
						</div>
					) : (
						<>
							{user?.profile_picture ? (
								<img
									src={user.profile_picture}
									alt={user.name}
									className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
										e.currentTarget.nextElementSibling?.classList.remove('hidden');
									}}
								/>
							) : null}
							<div className={`w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 ${user?.profile_picture ? 'hidden' : ''}`}>
								<FaUser className="text-indigo-600 text-4xl" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900">
								{user.name}
							</h2>
						</>
					)}
					
					<span
						className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
							user.role === "admin"
								? "bg-purple-100 text-purple-800"
								: user.role === "department"
								? "bg-blue-100 text-blue-800"
								: "bg-green-100 text-green-800"
						}`}
					>
						{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
					</span>
				</div>

				<div className="space-y-4">
					<div className="flex items-start space-x-3">
						<FaEnvelope className="text-gray-400 mt-1" />
						<div>
							<p className="text-sm text-gray-500">Email</p>
							<p className="text-gray-900">{user.email}</p>
						</div>
					</div>

					<div className="flex items-start space-x-3">
						<FaCalendarAlt className="text-gray-400 mt-1" />
						<div>
							<p className="text-sm text-gray-500">
								Member Since
							</p>
							<p className="text-gray-900">
								{formatDate(user.created_at)}
							</p>
						</div>
					</div>

					{user.department && (
						<div className="flex items-start space-x-3">
							<FaBuilding className="text-gray-400 mt-1" />
							<div>
								<p className="text-sm text-gray-500">
									Department
								</p>
								<p className="text-gray-900 font-medium">
									{user.department.name}
								</p>
								{user.department.description && (
									<p className="text-sm text-gray-600 mt-1">
										{user.department.description}
									</p>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="mt-6 pt-6 border-t border-gray-200">
					<h3 className="text-sm font-medium text-gray-500 mb-3">
						Issue Statistics
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-gray-900">
								{stats.total}
							</p>
							<p className="text-sm text-gray-500">
								Total Issues
							</p>
						</div>
						<div className="text-center">
							<p className="text-2xl font-bold text-green-600">
								{stats.resolved}
							</p>
							<p className="text-sm text-gray-500">Resolved</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDetails;
