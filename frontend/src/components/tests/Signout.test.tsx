import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { AuthError } from "@supabase/supabase-js";
import SignOut from "../SignOut";
import userReducer, { setUser } from "../../store/userSlice";
import { supabase } from "../../lib/supabaseClient";
import type { RootState } from "../../store";

vi.mock("../../lib/supabaseClient", () => ({
    supabase: {
        auth: {
            signOut: vi.fn(),
        },
    },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("SignOut Component Tests", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();

        store = configureStore({
            reducer: {
                user: userReducer,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    thunk: false,
                    serializableCheck: false,
                }),
        });
    });

    const renderSignOut = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <SignOut />
                </BrowserRouter>
            </Provider>
        );
    };

    it("renders the sign out button with correct styling", () => {
        const { container } = renderSignOut();
        const button = container.querySelector("button");

        expect(button).toBeInTheDocument();
        expect(button).toHaveClass(
            "flex",
            "items-center",
            "space-x-2",
            "hover:bg-red-100",
            "text-red-600"
        );
    });

    it("displays sign out icon", () => {
        renderSignOut();
        const button = screen.getByRole("button");
        const icon = button.querySelector("svg");

        expect(icon).toBeInTheDocument();
    });

    it("displays 'Sign Out' text", () => {
        renderSignOut();
        expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });

    it("hides text on small screens with sm:inline class", () => {
        renderSignOut();
        const textSpan = screen.getByText("Sign Out");

        expect(textSpan).toHaveClass("hidden", "sm:inline");
    });

    it("calls supabase.auth.signOut when clicked", async () => {
        vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

        renderSignOut();
        const button = screen.getByRole("button");

        fireEvent.click(button);

        await waitFor(() => {
            expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
        });
    });

    it("clears user state after successful sign out", async () => {
        vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

        store.dispatch(setUser({ 
            id: "1", 
            name: "Test", 
            email: "test@example.com",
            role: "citizen",
            created_at: new Date().toISOString()
        }));

        renderSignOut();
        const button = screen.getByRole("button");

        fireEvent.click(button);

        await waitFor(() => {
            expect((store.getState() as RootState).user.currentUser).toBeNull();
        });
    });

    it("navigates to home page after successful sign out", async () => {
        vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

        renderSignOut();
        const button = screen.getByRole("button");

        fireEvent.click(button);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("handles sign out error gracefully", async () => {
        const mockError = new AuthError("Sign out failed", 500, "auth_error");
        vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: mockError });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        renderSignOut();
        const button = screen.getByRole("button");

        fireEvent.click(button);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error signing out:",
                "Sign out failed"
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect((store.getState() as RootState).user.currentUser).toBeNull();

        consoleErrorSpy.mockRestore();
    });

    it("has proper visual styling", () => {
        const { container } = renderSignOut();
        const button = container.querySelector("button");

        expect(button).toHaveClass(
            "hover:bg-red-100",
            "text-red-600",
            "font-medium",
            "py-2",
            "px-4",
            "rounded-md",
            "transition-colors",
            "duration-200"
        );
    });
});
