import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { AuthContext, type AuthContextType } from "../AuthContext";
import {
	mockGetSession,
	renderWithStore,
	mockUser,
} from "./AuthProvider.setup.tsx";

describe("AuthProvider - Context Value & Edge Cases", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Context Value", () => {
		it("provides correct AuthContext value with user and isAuthenticated", async () => {
			mockGetSession.mockResolvedValue({
				data: {
					session: {
						user: {
							id: mockUser.id,
						},
					},
				},
			});

			const TestConsumer = () => {
				const contextValue = React.useContext(AuthContext) as AuthContextType;
				return (
					<div>
						<div data-testid="user">
							{contextValue.user ? JSON.stringify(contextValue.user) : "null"}
						</div>
						<div data-testid="isAuthenticated">
							{String(contextValue.isAuthenticated)}
						</div>
						<div data-testid="isLoading">
							{String(contextValue.isLoading)}
						</div>
						<div data-testid="error">{contextValue.error || "null"}</div>
					</div>
				);
			};

			renderWithStore(<TestConsumer />, {
				user: {
					currentUser: mockUser,
					loading: false,
					error: null,
				},
			});

			await waitFor(() => {
				expect(screen.getByTestId("user").textContent).toContain(mockUser.id);
			});

			expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
			expect(screen.getByTestId("isLoading").textContent).toBe("false");
			expect(screen.getByTestId("error").textContent).toBe("null");
		});

		it("provides isAuthenticated as false when user is null", async () => {
			mockGetSession.mockResolvedValue({
				data: { session: null },
			});

			const TestConsumer = () => {
				const contextValue = React.useContext(AuthContext) as AuthContextType;
				return (
					<div data-testid="isAuthenticated">
						{String(contextValue.isAuthenticated)}
					</div>
				);
			};

			renderWithStore(<TestConsumer />, {
				user: {
					currentUser: null,
					loading: false,
					error: null,
				},
			});

			await waitFor(() => {
				expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
			});
		});
	});

	describe("Edge Cases", () => {
		it("handles session with partial user data", async () => {
			mockGetSession.mockResolvedValue({
				data: {
					session: {
						user: {
							id: null,
						},
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

		it("provides error from Redux store in context value", async () => {
			mockGetSession.mockResolvedValue({
				data: { session: null },
			});

			const TestConsumer = () => {
				const contextValue = React.useContext(AuthContext) as AuthContextType;
				return (
					<div>
						<div data-testid="error">{contextValue.error || "no-error"}</div>
						<div data-testid="user">{contextValue.user ? "has-user" : "no-user"}</div>
					</div>
				);
			};

			renderWithStore(<TestConsumer />, {
				user: {
					currentUser: null,
					loading: false,
					error: null,
				},
			});

			await waitFor(() => {
				expect(screen.getByTestId("error")).toBeInTheDocument();
				expect(screen.getByTestId("user")).toBeInTheDocument();
			});

			expect(screen.getByTestId("error").textContent).toBe("no-error");
			expect(screen.getByTestId("user").textContent).toBe("no-user");
		});
	});
});
