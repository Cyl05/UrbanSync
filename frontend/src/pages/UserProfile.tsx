import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../hooks/useAuth";
import type { Issue, Department, IssueStatus } from "../types/schema";
import LoadingScreen from "../components/LoadingScreen";
import OfficialIssueCard from "../components/OfficialIssueCard";
import UserNavBar from "../features/User/UserNavBar";
import UserDetails from "../features/User/UserDetails";

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
	const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");

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
		new: issues.filter((i: Issue & { department?: Department }) => i.status === "new").length,
		inProgress: issues.filter((i: Issue & { department?: Department }) => i.status === "in_progress").length,
	};

	const filteredIssues = statusFilter === "all"
		? issues 
		: issues.filter((issue) => (issue.status === statusFilter));

	
	return (
		<div className="min-h-screen bg-gray-50">
			<UserNavBar />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<UserDetails stats={stats} user={user} />
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-md">
							<div className="px-6 py-4 border-b border-gray-200 flex justify-between">
								<div>
									<h2 className="text-xl font-bold text-gray-900">
										All Issues
									</h2>
									<p className="text-sm text-gray-500 mt-1">
										{issues.length} {issues.length === 1 ? "issue" : "issues"} found
									</p>
								</div>
								<select
									id="statusFilter"
									value={statusFilter}
									onChange={(e) =>
										setStatusFilter(e.target.value as IssueStatus | "all")
									}
									className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								>
									<option value="all">All Issues ({stats.total})</option>
									<option value="new">New ({stats.new})</option>
									<option value="in_progress">In Progress ({stats.inProgress})</option>
									<option value="resolved">Resolved ({stats.resolved})</option>
								</select>
							</div>

							<div className="divide-y divide-gray-200">
								{filteredIssues.length === 0 ? (
									<div className="px-6 py-12 text-center">
										<p className="text-gray-500">No issues found</p>
									</div>
								) : (
									filteredIssues.map((issue: Issue & { department?: Department }) => (
										<OfficialIssueCard key={issue.id} issue={issue} />
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
