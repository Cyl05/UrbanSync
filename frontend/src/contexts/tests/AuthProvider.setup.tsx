import { vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import React from "react";
import { AuthProvider } from "../AuthProvider";
import userReducer from "../../store/userSlice";

export type AuthStateChangeCallback = (
	event: string,
	session: { user?: { id?: string | null } } | null
) => void;

// Mock Supabase client
export const mockGetSession = vi.fn();
export const mockUnsubscribe = vi.fn();
export const mockOnAuthStateChange = vi.fn();

vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		auth: {
			getSession: () => mockGetSession(),
			onAuthStateChange: (callback: AuthStateChangeCallback) => {
				mockOnAuthStateChange(callback);
				return {
					data: {
						subscription: {
							unsubscribe: mockUnsubscribe,
						},
					},
				};
			},
		},
	},
}));

// Mock Apollo Client to prevent saga from making real GraphQL calls
vi.mock("../../lib/client", () => ({
	createApolloClient: vi.fn(() => ({
		query: vi.fn().mockResolvedValue({
			data: {
				users: [],
			},
		}),
	})),
}));

// Helper function to create a test store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTestStore = (initialState?: any) => {
	const store = configureStore({
		reducer: {
			// @ts-expect-error - TypeScript has issue with reducer type
			user: userReducer,
		},
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false,
			}),
		// Note: We don't run saga middleware in tests to avoid side effects
	});
	return store;
};

// Helper function to render AuthProvider with Redux store
export const renderWithStore = (
	children: React.ReactNode,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	initialState?: any
) => {
	const store = createTestStore(initialState);
	const originalDispatch = store.dispatch;
	const dispatchSpy = vi.fn((action) => {
		// If fetch user is requested and we have initial user state, 
		// dispatch fetchUserSuccess instead to complete the saga flow
		if (
			action.type === "user/fetchUserRequest" &&
			initialState?.user?.currentUser
		) {
			originalDispatch({ 
				type: "user/fetchUserSuccess", 
				payload: initialState.user.currentUser 
			});
			return action;
		}
		return originalDispatch(action);
	});
	store.dispatch = dispatchSpy;

	const result = render(
		<Provider store={store}>
			<AuthProvider>{children}</AuthProvider>
		</Provider>
	);

	return { ...result, store, dispatchSpy };
};

// Mock user data
export const mockUser = {
	id: "test-user-id",
	name: "Test User",
	email: "test@example.com",
	role: "citizen" as const,
	created_at: "2025-01-01T00:00:00Z",
};
