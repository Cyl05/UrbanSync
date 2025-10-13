import React from "react";
import { FaClock, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Issue } from "../types/schema";
import { formatDate } from "../utils/formatDate";
import IssueStatusBadge from "./issue/IssueStatusBadge";
import { IssueCategoryLabels } from "../types/schema";

interface OfficialIssueCardProps {
	issue: Issue;
	onStatusChange?: (issueId: string, newStatus: string) => void;
}

export const OfficialIssueCard: React.FC<OfficialIssueCardProps> = ({ issue, onStatusChange }) => {
	const navigate = useNavigate();

	const handleViewDetails = () => {
		navigate(`/issue/${issue.id}`);
	};

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		e.stopPropagation();
		if (onStatusChange) {
			onStatusChange(issue.id, e.target.value);
		}
	};

	return (
		<div 
			className="bg-white border border-gray-200 hover:border-indigo-300 transition-all duration-200 rounded-lg overflow-hidden cursor-pointer"
			onClick={handleViewDetails}
		>
			<div className="flex items-center p-4 gap-4">
				{issue.photo_url && (
					<div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100">
						<img
							src={issue.photo_url}
							alt="Issue thumbnail"
							className="w-full h-full object-cover"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = 'none';
							}}
						/>
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-3 mb-1">
						<h3 className="text-base font-semibold text-gray-900 truncate">
							{issue.title}
						</h3>
						<IssueStatusBadge status={issue.status} />
					</div>

					<div className="flex items-center gap-4 text-xs text-gray-500">
						<span className="inline-flex items-center">
							<FaClock className="mr-1" />
							{formatDate(issue.created_at)}
						</span>
						<span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">
							{IssueCategoryLabels[issue.issue_type] || issue.issue_type}
						</span>
					</div>
				</div>

				<div className="flex-shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
					<select
						id={`status-${issue.id}`}
						value={issue.status}
						onChange={handleStatusChange}
						className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
						onClick={(e) => e.stopPropagation()}
					>
						<option value="new">New</option>
						<option value="in_progress">In Progress</option>
						<option value="resolved">Resolved</option>
					</select>
				</div>

				<div className="flex-shrink-0">
					<FaChevronRight className="text-gray-400" />
				</div>
			</div>
		</div>
	);
};

export default OfficialIssueCard;
