import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
	mockGetSession,
	mockOnAuthStateChange,
	mockUnsubscribe,
	renderWithStore,
	type AuthStateChangeCallback,
} from "./AuthProvider.setup.tsx";

describe("AuthProvider - Auth State Change Subscription", () => {
	let authStateCallback: AuthStateChangeCallback | undefined;

	beforeEach(() => {
		vi.clearAllMocks();
		
		mockGetSession.mockResolvedValue({
			data: { session: null },
		});

		mockOnAuthStateChange.mockImplementation((callback: AuthStateChangeCallback) => {
			authStateCallback = callback;
		});
	});

	it("calls fetchUserRequest when auth event is SIGNED_IN and session.user.id exists", async () => {
		const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

		await waitFor(() => {
			expect(authStateCallback).toBeDefined();
		});

		dispatchSpy.mockClear();

		if (authStateCallback) {
			authStateCallback("SIGNED_IN", {
				user: { id: "new-user-id" },
			});
		}

		await waitFor(() => {
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "user/fetchUserRequest",
					payload: "new-user-id",
				})
			);
		});
	});

	it("does not call fetchUserRequest when SIGNED_IN event has no user.id", async () => {
		const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

		await waitFor(() => {
			expect(authStateCallback).toBeDefined();
		});

		dispatchSpy.mockClear();

		if (authStateCallback) {
			authStateCallback("SIGNED_IN", {
				user: {},
			});
		}

		expect(dispatchSpy).not.toHaveBeenCalledWith(
			expect.objectContaining({
				type: "user/fetchUserRequest",
			})
		);
	});

	it("calls clearUser when auth event is SIGNED_OUT", async () => {
		const { dispatchSpy } = renderWithStore(<div>Test Child</div>);

		await waitFor(() => {
			expect(authStateCallback).toBeDefined();
		});

		dispatchSpy.mockClear();

		if (authStateCallback) {
			authStateCallback("SIGNED_OUT", null);
		}

		await waitFor(() => {
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "user/clearUser",
				})
			);
		});
	});

	it("unsubscribes from auth state change subscription on unmount", async () => {
		mockGetSession.mockResolvedValue({
			data: { session: null },
		});

		const { unmount } = renderWithStore(<div>Test Child</div>);

		await waitFor(() => {
			expect(screen.getByText("Test Child")).toBeInTheDocument();
		});

		unmount();

		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
	});
});
