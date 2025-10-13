import { FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import type { IssueStatus } from "../../types/schema";

interface IssueStatusBadgeProps {
	status: IssueStatus;
}

const IssueStatusBadge = ({ status }: IssueStatusBadgeProps) => {
	switch (status) {
		case "new":
			return (
				<span className="inline-flex items-center gap-1.5 px-3 bg-red-100 text-red-800 rounded-full text-sm font-medium">
					<FaExclamationCircle /> New
				</span>
			);
		case "in_progress":
			return (
				<span className="inline-flex items-center gap-1.5 px-3 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
					<FaSpinner /> In Progress
				</span>
			);
		case "resolved":
			return (
				<span className="inline-flex items-center gap-1.5 px-3 bg-green-100 text-green-800 rounded-full text-sm font-medium">
					<FaCheckCircle /> Resolved
				</span>
			);
		default:
			return (
				<span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
					{status}
				</span>
			);
	}
};

export default IssueStatusBadge;
