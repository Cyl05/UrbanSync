import { FaMapMarkerAlt } from "react-icons/fa";
import type { Issue, User, Comment, Attachment } from "../../types/schema";
import CommentForm from "./CommentForm";

interface IssueMainContentProps {
	issue: Issue & {
		comments: Array<Comment & { user?: User }>;
		attachments: Array<Attachment & { user?: User }>;
	};
	formatDate: (dateString: string) => string;
}

const IssueMainContent = ({ issue, formatDate }: IssueMainContentProps) => {
	return (
		<div className="lg:col-span-2 space-y-6">
			{issue.photo_url && (
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<img
						src={issue.photo_url}
						alt={issue.title}
						className="w-full h-96 object-cover"
						onError={(e) => {
							e.currentTarget.style.display = "none";
						}}
					/>
				</div>
			)}

			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Description
				</h2>
				<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
					{issue.description || "No description provided."}
				</p>
			</div>

			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<FaMapMarkerAlt className="text-red-500" /> Location
				</h2>
				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-500">Latitude:</span>
							<p className="font-medium text-gray-900">
								{issue.latitude.toFixed(6)}
							</p>
						</div>
						<div>
							<span className="text-gray-500">Longitude:</span>
							<p className="font-medium text-gray-900">
								{issue.longitude.toFixed(6)}
							</p>
						</div>
					</div>
					<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
						<iframe
							title="Issue Location"
							width="100%"
							height="100%"
							frameBorder="0"
							src={`https://www.openstreetmap.org/export/embed.html?bbox=${
								issue.longitude - 0.005
							},${issue.latitude - 0.005},${
								issue.longitude + 0.005
							},${issue.latitude + 0.005}&layer=mapnik&marker=${
								issue.latitude
							},${issue.longitude}`}
						/>
					</div>
				</div>
			</div>

			{issue.comments && issue.comments.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Activity & Comments
					</h2>
					<div className="space-y-4">
						{issue.comments.map((comment) => (
							<div
								key={comment.id}
								className="bg-indigo-100 px-5 py-2 rounded-t-md rounded-r-md"
							>
								<div className="flex items-center justify-between mb-2 border-b-2 border-gray-400">
									<div className="flex items-center gap-2">
										<span className="font-medium text-gray-900">
											{comment.user?.name ||
												"Unknown User"}
										</span>
										{comment.user?.role && (
											<span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
												{comment.user.role}
											</span>
										)}
									</div>
									<span className="text-sm text-gray-500">
										{formatDate(comment.created_at)}
									</span>
								</div>
								<p className="text-gray-700 whitespace-pre-wrap">
									{comment.content}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			<CommentForm
				issueId={issue.id}
				onSubmitComment={(content) => {
					console.log("New comment:", { content });
				}}
			/>

			{issue.attachments && issue.attachments.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Attachments
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{issue.attachments.map((attachment) => (
							<a
								key={attachment.id}
								href={attachment.url}
								target="_blank"
								rel="noopener noreferrer"
								className="group block border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
										<svg
											className="w-6 h-6 text-indigo-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
											/>
										</svg>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
											Attachment
										</p>
										{attachment.user?.name && (
											<p className="text-xs text-gray-500 mt-1">
												Uploaded by{" "}
												{attachment.user.name}
											</p>
										)}
										<p className="text-xs text-gray-400 mt-0.5">
											{formatDate(attachment.created_at)}
										</p>
									</div>
								</div>
							</a>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default IssueMainContent;
