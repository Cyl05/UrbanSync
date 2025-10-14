import React from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatDate";
import type { Issue, Department } from "../types/schema";
import LoadingScreen from "../components/LoadingScreen";
import { FaUser, FaEnvelope, FaCalendarAlt, FaBuilding, FaArrowLeft } from "react-icons/fa";
import OfficialIssueCard from "../components/OfficialIssueCard";
import SignOut from "../components/SignOut";

const GET_USER_ISSUES = gql`
	query GetUserIssues($userId: uuid!) {
		issues(
			where: { created_by: { _eq: $userId } }
			order_by: { created_at: desc }
		) {
			id
			title
			description
			status
			issue_type
			latitude
			longitude
			photo_url
			created_at
			updated_at
			department {
				id
				name
			}
		}
	}
`;

interface UserIssuesData {
	issues: (Issue & { department?: Department })[];
}

const UserProfile: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const { data, loading, error } = useQuery<UserIssuesData>(GET_USER_ISSUES, {
		variables: { userId: user?.id },
		skip: !user?.id,
	});

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-gray-600 text-lg">No user data available</p>
					<button
						onClick={() => navigate("/login")}
						className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Go to Login
					</button>
				</div>
			</div>
		);
	}

	if (loading) return <LoadingScreen />;

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-red-600 text-lg">Error loading issues: {error.message}</p>
				</div>
			</div>
		);
	}

	const issues = data?.issues || [];

	const stats = {
		total: issues.length,
		resolved: issues.filter((i: Issue & { department?: Department }) => i.status === "resolved").length,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<button
							onClick={() => navigate("/")}
							className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
						>
							<FaArrowLeft />
							<span>Back to Map</span>
						</button>
						<h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
						<SignOut />
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="text-center mb-6">
								<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaUser className="text-indigo-600 text-4xl" />
								</div>
								<h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
								<span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
									user.role === "admin" 
										? "bg-purple-100 text-purple-800" 
										: user.role === "department"
										? "bg-blue-100 text-blue-800"
										: "bg-green-100 text-green-800"
								}`}>
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
										<p className="text-sm text-gray-500">Member Since</p>
										<p className="text-gray-900">{formatDate(user.created_at)}</p>
									</div>
								</div>

								{user.department && (
									<div className="flex items-start space-x-3">
										<FaBuilding className="text-gray-400 mt-1" />
										<div>
											<p className="text-sm text-gray-500">Department</p>
											<p className="text-gray-900 font-medium">{user.department.name}</p>
											{user.department.description && (
												<p className="text-sm text-gray-600 mt-1">{user.department.description}</p>
											)}
										</div>
									</div>
								)}
							</div>

							<div className="mt-6 pt-6 border-t border-gray-200">
								<h3 className="text-sm font-medium text-gray-500 mb-3">Issue Statistics</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="text-center">
										<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
										<p className="text-sm text-gray-500">Total Issues</p>
									</div>
									<div className="text-center">
										<p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
										<p className="text-sm text-gray-500">Resolved</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-md">
							<div className="px-6 py-4 border-b border-gray-200">
								<h2 className="text-xl font-bold text-gray-900">
									All Issues
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{issues.length} {issues.length === 1 ? "issue" : "issues"} found
								</p>
							</div>

							<div className="divide-y divide-gray-200">
								{issues.length === 0 ? (
									<div className="px-6 py-12 text-center">
										<p className="text-gray-500">No issues found</p>
									</div>
								) : (
									issues.map((issue: Issue & { department?: Department }) => (
										<OfficialIssueCard issue={issue} />
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
