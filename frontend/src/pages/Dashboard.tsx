import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FaMapMarkerAlt,
	FaSignOutAlt,
	FaList,
	FaMap,
	FaBell,
	FaCog,
} from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";
import { useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/userSlice";
import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useAuth();

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Error signing out:", error.message);
				return;
			}
			dispatch(clearUser());
			navigate("/");
		} catch (err) {
			console.error("Unexpected error during sign out:", err);
		}
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600">No user data available</p>
				</div>
			</div>
		);
	}

	const mockStats = {
		totalIssues: 47,
		newIssues: 12,
		inProgress: 23,
		resolved: 12,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-3">
							<FaMapMarkerAlt className="h-8 w-8 text-indigo-600" />
							<div>
								<h1 className="text-xl font-bold text-gray-900">
									UrbanSync
								</h1>
								<p className="text-xs text-gray-500">
									Official Dashboard
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div className="hidden md:block">
								<p className="text-sm font-medium text-gray-700">
									{user.name}
								</p>
								<p className="text-xs text-gray-500 capitalize">
									{user.role}
								</p>
							</div>
							<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">
								<FaBell className="h-5 w-5" />
							</button>
							<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">
								<FaCog className="h-5 w-5" />
							</button>
							<button
								onClick={handleSignOut}
								className="flex items-center space-x-2 text-sm text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-colors cursor-pointer"
							>
								<FaSignOutAlt className="h-4 w-4" />
								<span>Sign Out</span>
							</button>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Welcome back, {user.name}
					</h2>
					<p className="text-gray-600">
						Manage civic issues reported by your community
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Issues
								</p>
								<p className="text-3xl font-bold text-gray-900">
									{mockStats.totalIssues}
								</p>
							</div>
							<div className="p-3 bg-blue-50 rounded-full">
								<FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									New
								</p>
								<p className="text-3xl font-bold text-red-600">
									{mockStats.newIssues}
								</p>
							</div>
							<div className="p-3 bg-red-50 rounded-full">
								<FaBell className="h-6 w-6 text-red-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									In Progress
								</p>
								<p className="text-3xl font-bold text-yellow-600">
									{mockStats.inProgress}
								</p>
							</div>
							<div className="p-3 bg-yellow-50 rounded-full">
								<FaCog className="h-6 w-6 text-yellow-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Resolved
								</p>
								<p className="text-3xl font-bold text-green-600">
									{mockStats.resolved}
								</p>
							</div>
							<div className="p-3 bg-green-50 rounded-full">
								<div className="h-6 w-6 rounded-full bg-green-600"></div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Quick Actions
								</h3>
							</div>
							<div className="space-y-3">
								<Link
									to="/admin/map"
									className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group"
								>
									<FaMap className="h-5 w-5 text-indigo-600" />
									<div>
										<p className="font-medium text-gray-900 group-hover:text-indigo-900">
											View Issues on Map
										</p>
										<p className="text-sm text-gray-600">
											Interactive map view of all reported
											issues
										</p>
									</div>
								</Link>
								<Link
									to="/admin/issues"
									className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
								>
									<FaList className="h-5 w-5 text-gray-600" />
									<div>
										<p className="font-medium text-gray-900 group-hover:text-gray-700">
											Manage Issues
										</p>
										<p className="text-sm text-gray-600">
											List view with filtering and sorting
											options
										</p>
									</div>
								</Link>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Recent Activity
							</h3>
							<div className="space-y-4">
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">
											New pothole reported on Main Street
										</p>
										<p className="text-xs text-gray-500">
											2 minutes ago
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">
											Streetlight issue assigned to
											Electrical Dept.
										</p>
										<p className="text-xs text-gray-500">
											15 minutes ago
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">
											Graffiti cleanup completed on Oak
											Avenue
										</p>
										<p className="text-xs text-gray-500">
											1 hour ago
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
									<div className="flex-1">
										<p className="text-sm text-gray-900">
											New user registered: Jane Smith
										</p>
										<p className="text-xs text-gray-500">
											2 hours ago
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
