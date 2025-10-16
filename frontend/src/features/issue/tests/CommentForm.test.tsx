import { render, screen } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from "vitest";
import CommentForm from "../CommentForm";

const mockIssueId = 'issue-123';

const mockUseAuth = vi.fn();
vi.mock("../../../hooks/useAuth", () => ({
    useAuth: () => mockUseAuth()
}));

const mockUseMutation = vi.fn();
vi.mock("@apollo/client/react", async () => {
    const actual = await vi.importActual("@apollo/client/react");

    return {
        ...actual,
        useMutation: (...args: unknown[]) => mockUseMutation(...args)
    };
});

const mockAddComment = vi.fn();

describe("CommentForm Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(mockUseMutation).mockReturnValue([mockAddComment, { loading: false, error: null }]);
        
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    });

    const renderCommentForm = (issueId: string = mockIssueId) => {
        return render(<CommentForm issueId={issueId} />);
    }

    it("renders heading 'Add a Comment'", () => {
        renderCommentForm();

        expect(screen.getByText("Add a Comment")).toBeInTheDocument();
    });

    it("displays login warning when user is not authenticated", () => {
        renderCommentForm();
        
        expect(screen.getByText("Please log in to add a comment.")).toBeInTheDocument();
    });

    it("hides login warning when user is authenticated", () => {
        mockUseAuth.mockReturnValue({
            user: { id: "user-123", name: "Test User", role: "citizen", email: "test@example.com", created_at: "2025-01-01" },
            isAuthenticated: true,
            isLoading: false,
            error: null
        });

        renderCommentForm();

        expect(screen.queryByText("Please log in to add a comment.")).not.toBeInTheDocument();
    });

    it("displays error message when error state is set", async () => {
		renderCommentForm();
		
		expect(screen.queryByText("Please log in to add a comment.")).toBeInTheDocument();
    });

	it("submit button is disabled when textarea is empty", () => {
		const { container } = renderCommentForm();

		const postButton = container.querySelector("button");

		expect(postButton).toBeDisabled();
	});

	it("submit button is disabled when user is not authenticated  ", () => {
		const { container } = renderCommentForm();

		const postButton = container.querySelector("button");

		expect(postButton).toBeDisabled();
	});

	it("calls addComment mutation with correct variables when form is submitted", async () => {
		mockUseAuth.mockReturnValue({
            user: { id: "user-123", name: "Test User", role: "citizen", email: "test@example.com", created_at: "2025-01-01" },
            isAuthenticated: true,
            isLoading: false,
            error: null
        });

		const { container } = renderCommentForm();

		const user = userEvent.setup();

		const commentBox = container.querySelector("textarea") as Element;
		const postButton = container.querySelector("button") as Element;

		expect(screen.queryByText("Please log in to add a comment.")).not.toBeInTheDocument();

		await user.type(commentBox, "This is a comment");
		await user.click(postButton);

		expect(mockAddComment).toBeCalledTimes(1);
		expect(mockAddComment).toBeCalledWith({
			variables: {
				issue_id: mockIssueId,
				author_id: 'user-123',
				content: "This is a comment",
			},
		});
	});

	it("clears commentText after successful submission", async () => {
		mockUseAuth.mockReturnValue({
            user: { id: "user-123", name: "Test User", role: "citizen", email: "test@example.com", created_at: "2025-01-01" },
            isAuthenticated: true,
            isLoading: false,
            error: null
        });

		mockAddComment.mockResolvedValue({
			data: {
				insert_comments_one: {
					id: "comment-1",
					content: "This is a comment",
					created_at: new Date().toISOString(),
				}
			}
		});

		const { container } = renderCommentForm();

		const user = userEvent.setup();

		const commentBox = container.querySelector("textarea") as Element;
		const postButton = container.querySelector("button") as Element;

		expect(screen.queryByText("Please log in to add a comment.")).not.toBeInTheDocument();

		await user.type(commentBox, "This is a comment");
		await user.click(postButton);

		expect(mockAddComment).toBeCalledTimes(1);
		expect(commentBox).toHaveValue("");
	});

	it("sets isSubmitting to true during submission", async () => {
		mockUseAuth.mockReturnValue({
            user: { id: "user-123", name: "Test User", role: "citizen", email: "test@example.com", created_at: "2025-01-01" },
            isAuthenticated: true,
            isLoading: false,
            error: null
        });

		let resolvePromise: (value: unknown) => void;
		const submissionPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		mockAddComment.mockReturnValue(submissionPromise);

		const { container } = renderCommentForm();
		const user = userEvent.setup();

		const commentBox = container.querySelector("textarea") as HTMLTextAreaElement;
		const postButton = container.querySelector("button") as HTMLButtonElement;

		await user.type(commentBox, "This is a comment");
		await user.click(postButton);

		expect(commentBox).toBeDisabled();
		expect(postButton).toBeDisabled();

		resolvePromise!({
			data: {
				insert_comments_one: {
					id: "comment-1",
					content: "This is a comment",
					created_at: new Date().toISOString(),
				}
			}
		});
	});

	it("displays loading spinner and 'Posting...' text while submitting", async () => {
		mockUseAuth.mockReturnValue({
            user: { id: "user-123", name: "Test User", role: "citizen", email: "test@example.com", created_at: "2025-01-01" },
            isAuthenticated: true,
            isLoading: false,
            error: null
        });

		let resolvePromise: (value: unknown) => void;
		const submissionPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		mockAddComment.mockReturnValue(submissionPromise);

		const { container } = renderCommentForm();
		const user = userEvent.setup();

		const commentBox = container.querySelector("textarea") as HTMLTextAreaElement;
		const postButton = container.querySelector("button") as HTMLButtonElement;

		expect(screen.queryByText("Posting...")).not.toBeInTheDocument();
		expect(screen.getByText("Post Comment")).toBeInTheDocument();

		await user.type(commentBox, "This is a comment");
		await user.click(postButton);

		expect(screen.getByText("Posting...")).toBeInTheDocument();
		expect(container.querySelector(".animate-spin")).toBeInTheDocument();
		expect(screen.queryByText("Post Comment")).not.toBeInTheDocument();

		resolvePromise!({
			data: {
				insert_comments_one: {
					id: "comment-1",
					content: "This is a comment",
					created_at: new Date().toISOString(),
				}
			}
		});

		await vi.waitFor(() => {
			expect(screen.queryByText("Posting...")).not.toBeInTheDocument();
		});

		expect(screen.getByText("Post Comment")).toBeInTheDocument();
		expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
	});

	it("refetches query 'GetIssueDetails' after adding comment", () => {
		mockUseAuth.mockReturnValue({
            user: { id: "user-123", name: "Test User", role: "citizen", email: "test@example.com", created_at: "2025-01-01" },
            isAuthenticated: true,
            isLoading: false,
            error: null
        });

		renderCommentForm();

		expect(mockUseMutation).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				refetchQueries: ['GetIssueDetails'],
				awaitRefetchQueries: true,
			})
		);
	});
});
