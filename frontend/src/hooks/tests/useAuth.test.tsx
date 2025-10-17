import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useState } from "react";
import type { User } from "../../types/schema";
import { AuthContext, type AuthContextType } from "../../contexts/AuthContext";
import { useAuth } from "../useAuth";

const mockUser: User = {
    id: "user-123",
    name: "test-user",
    email: "test-email@gmail.com",
    role: "citizen",
    created_at: "2025-01-01",
};

const mockContext: AuthContextType = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    error: null,
};

describe("useAuth", () => {
    const TestComponent = () => {
        const auth = useAuth();
        return (
            <div>
                <div data-testid="user-id">{auth.user?.id || "null"}</div>
                <div data-testid="user-name">{auth.user?.name || "null"}</div>
                <div data-testid="user-email">{auth.user?.email || "null"}</div>
                <div data-testid="is-authenticated">{String(auth.isAuthenticated)}</div>
                <div data-testid="is-loading">{String(auth.isLoading)}</div>
                <div data-testid="error">{auth.error || "null"}</div>
            </div>
        );
    };

    const renderWithAuthContext = (contextValue: AuthContextType) => {
        return render(
            <AuthContext.Provider value={contextValue}>
                <TestComponent />
            </AuthContext.Provider>
        );
    };

    it("returns AuthContext value when used inside AuthProvider", () => {
        renderWithAuthContext(mockContext);

        expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
        expect(screen.getByTestId("user-name")).toHaveTextContent("test-user");
        expect(screen.getByTestId("user-email")).toHaveTextContent("test-email@gmail.com");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
        expect(screen.getByTestId("error")).toHaveTextContent("null");
    });

    it("provides correct user, isAuthenticated, isLoading, and error values from context", () => {
        const customContext: AuthContextType = {
            user: {
                id: "user-456",
                name: "Jane Doe",
                email: "jane@example.com",
                role: "department",
                created_at: "2025-02-15",
                department: {
                    id: "dept-123",
                    name: "Public Works",
                    description: "Public Works Department",
                },
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
        };

        renderWithAuthContext(customContext);

        expect(screen.getByTestId("user-id")).toHaveTextContent("user-456");
        expect(screen.getByTestId("user-name")).toHaveTextContent("Jane Doe");
        expect(screen.getByTestId("user-email")).toHaveTextContent("jane@example.com");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
        expect(screen.getByTestId("error")).toHaveTextContent("null");
    });

    it("updates returned context values when AuthContext changes", () => {
        // Component that toggles context values
        const UpdatingTestComponent = () => {
            const [contextValue, setContextValue] = useState<AuthContextType>({
                user: null,
                isAuthenticated: false,
                isLoading: true,
                error: null,
            });

            return (
                <AuthContext.Provider value={contextValue}>
                    <TestComponent />
                    <button
                        data-testid="update-button"
                        onClick={() =>
                            setContextValue({
                                user: mockUser,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            })
                        }
                    >
                        Update Context
                    </button>
                </AuthContext.Provider>
            );
        };

        render(<UpdatingTestComponent />);

        // Initial state
        expect(screen.getByTestId("user-id")).toHaveTextContent("null");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
        expect(screen.getByTestId("is-loading")).toHaveTextContent("true");

        // Update context using fireEvent
        fireEvent.click(screen.getByTestId("update-button"));

        // Updated state
        expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
        expect(screen.getByTestId("user-name")).toHaveTextContent("test-user");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
    });

    it("returns null user when no user is authenticated", () => {
        const unauthenticatedContext: AuthContextType = {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        };

        renderWithAuthContext(unauthenticatedContext);

        expect(screen.getByTestId("user-id")).toHaveTextContent("null");
        expect(screen.getByTestId("user-name")).toHaveTextContent("null");
        expect(screen.getByTestId("user-email")).toHaveTextContent("null");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    });

    it("returns error message when error exists in context", () => {
        const errorContext: AuthContextType = {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Authentication failed",
        };

        renderWithAuthContext(errorContext);

        expect(screen.getByTestId("error")).toHaveTextContent("Authentication failed");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    });

    it("returns loading state when authentication is in progress", () => {
        const loadingContext: AuthContextType = {
            user: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,
        };

        renderWithAuthContext(loadingContext);

        expect(screen.getByTestId("is-loading")).toHaveTextContent("true");
        expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    });
}); 