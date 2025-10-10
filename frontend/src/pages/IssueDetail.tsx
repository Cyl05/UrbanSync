import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";
import IssueStatusBadge from "../components/issue/IssueStatusBadge";
import IssueMainContent from "../components/issue/IssueMainContent";
import IssueSidebar from "../components/issue/IssueSidebar";
import { useIssueDetails } from "../hooks/useIssueDetails";
import { formatDate } from "../utils/formatDate";

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useIssueDetails(id);

  if (loading) return <LoadingScreen loadingText="Loading issue details..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Issue</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data?.issues_by_pk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-gray-400 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Issue Not Found</h2>
          <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
            <IssueStatusBadge status={issue.status} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <IssueMainContent issue={issue} formatDate={formatDate} />
          <IssueSidebar issue={issue} formatDate={formatDate} />
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
