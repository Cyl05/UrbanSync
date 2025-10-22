import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";
import IssueStatusBadge from "../features/issue/IssueStatusBadge";
import IssueMainContent from "../features/issue/IssueMainContent";
import IssueSidebar from "../features/issue/IssueSidebar";
import { useIssueDetails } from "../hooks/useIssueDetails";
import { formatDate } from "../utils/formatDate";
import ErrorDisplay from "../components/ErrorDisplay";

const IssueDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const { data, loading, error } = useIssueDetails(id);

	if (loading)
		return <LoadingScreen loadingText="Loading issue details..." />;
	if (error) {
		console.error(error);
		return (
			<ErrorDisplay message={'Error Loading Issue'} handleClick={() => navigate(-1)} buttonText="Go Back" />
		);
	}

	if (!data?.issues_by_pk) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
					<div className="text-gray-400 text-5xl mb-4">🔍</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						Issue Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						The issue you're looking for doesn't exist or has been
						removed.
					</p>
					<button
						onClick={() => navigate("/")}
						className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Back to Home
					</button>
				</div>
			</div>
		);
	}

	const issue = data.issues_by_pk;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<button
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 hover:bg-gray-100 cursor-pointer px-5 py-2 rounded-md"
					>
						<FaArrowLeft /> Back
					</button>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<h1 className="text-3xl font-bold text-gray-900" data-testid="issue-title">
							{issue.title}
						</h1>
						<IssueStatusBadge status={issue.status} />
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					<IssueMainContent 
						issue={issue} 
						formatDate={formatDate}
					/>
					<IssueSidebar issue={issue} formatDate={formatDate} />
				</div>
			</div>
		</div>
	);
};

export default IssueDetail;
