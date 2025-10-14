import React from "react";
import { useNavigate } from "react-router-dom";
import type { Department, Issue } from "../types/schema";
import { formatDate } from "../utils/formatDate";
import IssueStatusBadge from "../features/issue/IssueStatusBadge";
import { IssueCategoryLabels } from "../types/schema";
import { FaBuilding, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface OfficialIssueCardProps {
	issue: Issue & {
		department?: Department
	};
	onStatusChange?: (issueId: string, newStatus: string) => void;
}

export const OfficialIssueCard: React.FC<OfficialIssueCardProps> = ({
	issue,
	onStatusChange,
}) => {
	const navigate = useNavigate();

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		e.stopPropagation();
		if (onStatusChange) {
			onStatusChange(issue.id, e.target.value);
		}
	};

	return (
		<div
			key={issue.id}
			onClick={() => navigate(`/issue/${issue.id}`)}
			className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1 min-w-0">
					<div className="flex items-center space-x-3 mb-2">
						<h3 className="text-lg font-semibold text-gray-900 truncate">
							{issue.title}
						</h3>
						<IssueStatusBadge status={issue.status} />
						{onStatusChange && (
							<select
								value={issue.status}
								onChange={handleStatusChange}
								onClick={(e) => e.stopPropagation()}
								className="ml-2 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value="new">New</option>
								<option value="in_progress">In Progress</option>
								<option value="resolved">Resolved</option>
							</select>
						)}
					</div>

					{issue.description && (
						<p className="text-gray-600 text-sm line-clamp-2 mb-2">
							{issue.description}
						</p>
					)}

					<div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
						<span className="inline-flex items-center space-x-1">
							<FaMapMarkerAlt className="text-gray-400" />
							<span>
								{issue.latitude.toFixed(4)},{" "}
								{issue.longitude.toFixed(4)}
							</span>
						</span>

						<span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
							{
								IssueCategoryLabels[
									issue.issue_type
								]
							}
						</span>

						<span className="inline-flex items-center space-x-1">
							<FaBuilding />
							<span>{issue.department?.name}</span>
						</span>

						<span className="inline-flex items-center space-x-1">
							<FaCalendarAlt className="text-gray-400" />
							<span>{formatDate(issue.created_at)}</span>
						</span>
					</div>
				</div>

				{issue.photo_url && (
					<div className="ml-4 flex-shrink-0">
						<img
							src={issue.photo_url}
							alt={issue.title}
							className="w-20 h-20 object-cover rounded-lg"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default OfficialIssueCard;
