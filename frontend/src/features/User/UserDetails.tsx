import React from "react";
import { formatDate } from "../../utils/formatDate";
import { FaUser, FaEnvelope, FaCalendarAlt, FaBuilding } from "react-icons/fa";
import type { User } from "../../types/schema";

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
	return (
		<div className="lg:col-span-1">
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="text-center mb-6">
					{user?.profile_picture ? (
						<img
							src={user.profile_picture}
							className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
						/>
					) : (
						<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FaUser className="text-indigo-600 text-4xl" />
						</div>
					)}
					<h2 className="text-2xl font-bold text-gray-900">
						{user.name}
					</h2>
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
