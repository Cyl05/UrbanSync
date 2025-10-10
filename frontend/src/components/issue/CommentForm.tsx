import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../hooks/useAuth";
import { gql } from "@apollo/client";

interface CommentFormProps {
	issueId: string;
	onCommentAdded?: () => void;
}

const ADD_COMMENT = gql`
  mutation AddComment($issue_id: uuid!, $author_id: uuid!, $content: String!) {
    insert_comments_one(
      object: {
        issue_id: $issue_id
        author_id: $author_id
        content: $content
      }
    ) {
      id
      content
      created_at
      user {
        id
        name
        role
      }
    }
  }
`;


const CommentForm = ({ issueId, onCommentAdded }: CommentFormProps) => {
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuth();
	const [addComment] = useMutation(ADD_COMMENT);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!commentText.trim()) {
			return;
		}

		if (!user) {
			setError("You must be logged in to comment");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			await addComment({
				variables: {
					issue_id: issueId,
					author_id: user.id,
					content: commentText.trim(),
				},
			});

			setCommentText("");
			
			if (onCommentAdded) {
				onCommentAdded();
			}
		} catch (err) {
			console.error("Error adding comment:", err);
			setError("Failed to add comment. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-xl font-semibold text-gray-900 mb-4">
				Add a Comment
			</h2>
			{error && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}
			{!user && (
				<div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-sm text-yellow-800">
						Please log in to add a comment.
					</p>
				</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<textarea
						id="comment"
						rows={4}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder="Add your comment or update about this issue..."
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
						disabled={isSubmitting}
					/>
				</div>

				<div className="flex justify-end pt-2">
					<button
						type="submit"
						disabled={!commentText.trim() || isSubmitting || !user}
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
