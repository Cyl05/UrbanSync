import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";
import OfficialIssueCard from "../components/OfficialIssueCard";
import type { Issue, IssueStatus } from "../types/schema";
import {
	FaTachometerAlt,
	FaFilter,
} from "react-icons/fa";
import ErrorDisplay from "../components/ErrorDisplay";
import SignOut from "../components/SignOut";

const GET_DEPARTMENT_ISSUES = gql`
	query GetDepartmentIssues($departmentId: uuid!) {
		issues(
			where: { assigned_department: { _eq: $departmentId } }
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
			created_by
			assigned_department
			created_at
			updated_at
		}
	}
`;

const UPDATE_ISSUE_STATUS = gql`
	mutation UpdateIssueStatus($issueId: uuid!, $status: issue_status!) {
		update_issues_by_pk(
			pk_columns: { id: $issueId }
			_set: { status: $status }
		) {
			id
			status
		}
	}
`;

type GetDepartmentIssuesData = {
	issues: Issue[];
};

const OfficialDashboard: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");

	const departmentId = user?.department?.id;

	const {
		loading,
		error,
		data,
		refetch,
	} = useQuery<GetDepartmentIssuesData>(GET_DEPARTMENT_ISSUES, {
		variables: { departmentId },
		skip: !departmentId,
	});

	const [updateIssueStatus] = useMutation(UPDATE_ISSUE_STATUS, {
		onCompleted: (data) => {
			console.log("Status update successful:", data);
			refetch();
		},
		onError: (err: Error) => {
			console.error("Error updating issue status:", err);
			alert("Failed to update issue status. Please try again.");
		},
		refetchQueries: [
			{
				query: GET_DEPARTMENT_ISSUES,
				variables: { departmentId },
			},
		],
		awaitRefetchQueries: true,
	});

	const handleStatusChange = async (issueId: string, newStatus: string) => {
		console.log("Attempting to update status:", { issueId, newStatus });
		
		try {
			const result = await updateIssueStatus({
				variables: {
					issueId,
					status: newStatus,
				},
			});
			
			console.log("Mutation result:", result);
			
			if (result.data) {
				console.log("Status updated successfully!");
			}
		} catch (err) {
			console.error("Error updating status:", err);
			alert("Failed to update status. Please check console for details.");
		}
	};

	if (user?.role !== "department") {
		<ErrorDisplay 
			message={"This dashboard is accessible only to department officials" }
			handleClick={() => navigate('/')} 
			buttonText={'Go Home'} 
		/>
	}

	if (!departmentId) {
		return (
			<ErrorDisplay 
				message={'Your account is not assigned to any department. Please contact an administrator.'} 
				handleClick={() => navigate('/')} 
				buttonText="Go Home" 
			/>
		);
	}

	if (loading) {
		return <LoadingScreen loadingText="Loading department issues..." />;
	}

	if (error) {
		return (
			<ErrorDisplay message={error.message} buttonText={'Retry'} handleClick={() => refetch()} />
		);
	}

	const issues = data?.issues || [];

	const filteredIssues =
		statusFilter === "all"
			? issues
			: issues.filter((issue: Issue) => issue.status === statusFilter);

	const stats = {
		total: issues.length,
		new: issues.filter((i: Issue) => i.status === "new").length,
		inProgress: issues.filter((i: Issue) => i.status === "in_progress").length,
		resolved: issues.filter((i: Issue) => i.status === "resolved").length,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-md border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<FaTachometerAlt className="text-indigo-600 text-3xl" />
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Department Dashboard
								</h1>
								<p className="text-sm text-gray-600">
									{user.department?.name || "Unknown Department"}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div className="text-right hidden sm:block">
								<p className="text-sm font-medium text-gray-900">{user.name}</p>
								<p className="text-xs text-gray-500">{user.email}</p>
							</div>
							<SignOut />
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 uppercase">
									Total Issues
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									{stats.total}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 uppercase">
									New
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									{stats.new}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 uppercase">
									In Progress
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									{stats.inProgress}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 uppercase">
									Resolved
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									{stats.resolved}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-t-lg shadow-md p-6 border-b border-gray-600">
					<div className="flex items-center space-x-4">
						<FaFilter className="text-gray-500 text-xl" />
						<label htmlFor="statusFilter" className="font-medium text-gray-700">
							Filter by Status:
						</label>
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
				</div>

				{filteredIssues.length === 0 ? (
					<div className="bg-white rounded-b-lg shadow-md p-12 text-center">
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							No Issues Found
						</h3>
						<p className="text-gray-500">
							{statusFilter === "all"
								? "Your department has no assigned issues yet."
								: `No issues with status "${statusFilter}" found.`}
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{filteredIssues.map((issue: Issue) => (
							<OfficialIssueCard
								key={issue.id}
								issue={issue}
								onStatusChange={handleStatusChange}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
};

export default OfficialDashboard;
