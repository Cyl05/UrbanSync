import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
	mockGetSession,
	renderWithStore,
} from "./AuthProvider.setup.tsx";

describe("AuthProvider - Initialization & Loading States", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		console.error = vi.fn();
	});

	describe("Loading States", () => {
		it("renders LoadingScreen while isInitializing is true", async () => {
			mockGetSession.mockResolvedValue({
				data: { session: null },
			});

			renderWithStore(<div>Test Child</div>);

			expect(screen.getByText("Loading...")).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
			});
		});

		it("renders LoadingScreen while userLoading is true", async () => {
			mockGetSession.mockResolvedValue({
				data: {
					session: {
						user: { id: "test-user-id" },
					},
				},
			});

			renderWithStore(<div>Test Child</div>, {
				user: {
					currentUser: null,
					loading: true,
					error: null,
				},
			});

			expect(screen.getByText("Loading...")).toBeInTheDocument();
		});
	});

	describe("Session Initialization", () => {
		it("dispatches fetchUserRequest when session contains a valid user id", async () => {
			mockGetSession.mockResolvedValue({
				data: {
					session: {
						user: { id: "test-user-id" },
					},
				},
			});

			const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

			await waitFor(() => {
				expect(dispatchSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						type: "user/fetchUserRequest",
						payload: "test-user-id",
					})
				);
			});
		});

		it("dispatches clearUser when no session or session.user.id is missing", async () => {
			mockGetSession.mockResolvedValue({
				data: { session: null },
			});

			const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

			await waitFor(() => {
				expect(dispatchSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						type: "user/clearUser",
					})
				);
			});
		});

		it("dispatches clearUser when session exists but user.id is missing", async () => {
			mockGetSession.mockResolvedValue({
				data: {
					session: {
						user: {},
					},
				},
			});

			const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

			await waitFor(() => {
				expect(dispatchSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						type: "user/clearUser",
					})
				);
			});
		});

		it("dispatches clearUser when supabase.auth.getSession throws an error", async () => {
			mockGetSession.mockRejectedValue(new Error("Network error"));

			const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

			await waitFor(() => {
				expect(dispatchSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						type: "user/clearUser",
					})
				);
			});
		});

		it("sets isInitializing to false after initialization completes", async () => {
			mockGetSession.mockResolvedValue({
				data: { session: null },
			});

			renderWithStore(<div>Test Child</div>);

			expect(screen.getByText("Loading...")).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText("Test Child")).toBeInTheDocument();
				expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
			});
		});

		it("console.error is called when auth initialization throws an error", async () => {
			const testError = new Error("Auth initialization failed");
			mockGetSession.mockRejectedValue(testError);

			renderWithStore(<div>Test Child</div>);

			await waitFor(() => {
				expect(console.error).toHaveBeenCalledWith(
					"Auth initialization error:",
					testError
				);
			});
		});
	});

	describe("Children Rendering", () => {
		it("renders children when initialization is complete and userLoading is false", async () => {
			mockGetSession.mockResolvedValue({
				data: { session: null },
			});

			renderWithStore(
				<div data-testid="test-child">Test Child Content</div>,
				{
					user: {
						currentUser: {
							id: "test-user-id",
							name: "Test User",
							email: "test@example.com",
							role: "citizen",
							created_at: "2025-01-01T00:00:00Z",
						},
						loading: false,
						error: null,
					},
				}
			);

			await waitFor(() => {
				expect(screen.getByTestId("test-child")).toBeInTheDocument();
			});

			expect(screen.getByText("Test Child Content")).toBeInTheDocument();
		});
	});
});
