import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface CommentFormProps {
	issueId: string;
	onSubmitComment?: (content: string) => void;
}

const CommentForm = ({ issueId: _issueId, onSubmitComment }: CommentFormProps) => {
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!commentText.trim()) {
			return;
		}

		setIsSubmitting(true);

		if (onSubmitComment) {
			onSubmitComment(commentText.trim());
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));

		setCommentText("");
		setIsSubmitting(false);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-xl font-semibold text-gray-900 mb-4">
				Add a Comment
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="comment"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Your Comment
					</label>
					<textarea
						id="comment"
						rows={4}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder="Add your comment or update about this issue..."
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
						disabled={isSubmitting}
					/>
					<p className="mt-1 text-sm text-gray-500">
						{commentText.length} / 500 characters
					</p>
				</div>

				<div className="flex justify-end pt-2">
					<button
						type="submit"
						disabled={!commentText.trim() || isSubmitting}
						className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? (
							<>
								<svg
									className="animate-spin h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Posting...
							</>
						) : (
							<>
								<FaPaperPlane />
								Post Comment
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CommentForm;
