import {
	FaClock,
	FaUser,
	FaBuilding,
	FaExclamationCircle,
} from "react-icons/fa";
import type { Issue, User, Department, DepartmentUpdate } from "../../types/schema";
import { IssueCategoryLabels } from "../../types/schema";
import { useNavigate } from "react-router-dom";
import DepartmentUpdates from "./DepartmentUpdates";
import DepartmentUpdateForm from "./DepartmentUpdateForm";
import { useAuth } from "../../hooks/useAuth";

interface IssueSidebarProps {
	issue: Issue & {
		userByCreatedBy?: User;
		department?: Department;
		user?: User;
		department_updates?: Array<DepartmentUpdate>
	};
	formatDate: (dateString: string) => string;
}
const IssueSidebar = ({ issue, formatDate }: IssueSidebarProps) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	return (
		<div className="space-y-6 col-span-2" data-testid="issue-sidebar">
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Issue Details
				</h2>
				<div className="space-y-4">
					{issue.issue_type && (
						<div>
							<div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
								<FaExclamationCircle />
								<span>Category</span>
							</div>
							<p className="text-gray-900 font-medium" data-testid="issue-category">
								{IssueCategoryLabels[issue.issue_type] ||
									issue.issue_type}
							</p>
						</div>
					)}

					{issue.user && (
						<div>
							<div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
								<FaUser />
								<span>Reported By:</span>
							</div>
							<p className="text-gray-900 font-medium">
								{issue.user.name}
							</p>
							<p className="text-gray-600 text-sm">
								{issue.user.email}
							</p>
						</div>
					)}

					{issue.department && (
						<div>
							<div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
								<FaBuilding />
								<span>Assigned Department</span>
							</div>
							<p className="text-gray-900 font-medium" data-testid="issue-assigned-department">
								{issue.department.name}
							</p>
							{issue.department.description && (
								<p className="text-gray-600 text-sm">
									{issue.department.description}
								</p>
							)}
						</div>
					)}

					<div>
						<div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
							<FaClock />
							<span>Created</span>
						</div>
						<p className="text-gray-900 text-sm" data-testid="issue-created-date">
							{formatDate(issue.created_at)}
						</p>
					</div>

					<div>
						<div className="flex items-center gap-2 text-gray-500 text-sm mb-1" data-testid="issue-updated-date">
							<FaClock />
							<span>Last Updated</span>
						</div>
						<p className="text-gray-900 text-sm">
							{formatDate(issue.updated_at)}
						</p>
					</div>
				</div>
			</div>

			<DepartmentUpdates
				updates={issue.department_updates}
				formatDate={formatDate}
			/>

			{ issue.department?.id === user?.department?.id && (
				<DepartmentUpdateForm issueId={issue.id} />
			)}

			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Actions
				</h2>
				<div className="space-y-3">
					<button
						onClick={() =>
							window.open(
								`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`,
								"_blank"
							)
						}
						className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium cursor-pointer"
					>
						View on Google Maps
					</button>
					<button
						onClick={() => navigate("/")}
						className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium cursor-pointer"
					>
						Back to Map
					</button>
				</div>
			</div>
		</div>
	);
};

export default IssueSidebar;
