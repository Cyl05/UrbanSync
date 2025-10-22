import { useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface DepartmentUpdateFormProps {
	issueId: string;
}

const ADD_DEPARTMENT_UPDATE = gql`
	mutation AddDepartmentUpdate(
		$issue_id: uuid!
		$author_id: uuid!
		$content: String!
	) {
		insert_department_updates_one(
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
				department {
					id
					name
				}
			}
		}
	}
`;

const DepartmentUpdateForm = ({ issueId }: DepartmentUpdateFormProps) => {
	const [updateText, setUpdateText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuth();
	const [addUpdate] = useMutation(ADD_DEPARTMENT_UPDATE, {
		refetchQueries: ["GetIssueDetails"],
		awaitRefetchQueries: true,
	});

	if (!user || user.role !== "department") {
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!updateText.trim()) {
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			await addUpdate({
				variables: {
					issue_id: issueId,
					author_id: user.id,
					content: updateText.trim(),
				},
			});

			setUpdateText("");
		} catch (err) {
			console.error("Error adding department update:", err);
			setError("Failed to post update. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm p-6" data-testid="department-update-form">
			<h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
				Post Department Update
			</h2>
			{error && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" data-testid="error-message">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-4" data-testid="update-form">
				<div>
					<textarea
						id="department-update"
						rows={5}
						value={updateText}
						onChange={(e) => setUpdateText(e.target.value)}
						placeholder="Provide an official update about this issue"
						className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none focus:outline-none"
						disabled={isSubmitting}
						data-testid="update-textarea"
					/>
					<p className="text-xs text-gray-500 mt-1">
						This update will be publicly visible and marked as an
						official department communication.
					</p>
				</div>

				<div className="flex justify-end pt-2">
					<button
						type="submit"
						disabled={!updateText.trim() || isSubmitting}
						className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
						data-testid="submit-update-button"
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
								Publishing...
							</>
						) : (
							<>
								<FaBullhorn />
								Publish Update
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default DepartmentUpdateForm;
