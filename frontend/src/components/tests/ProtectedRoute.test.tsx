import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { userEvent } from "@testing-library/user-event";

const mockUseAuth = vi.fn();
vi.mock("../../hooks/useAuth", () => ({
	useAuth: () => mockUseAuth()
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate
	};
});

describe("ProtectedRoute Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderProtectedRoute = (children: React.ReactNode, role?: string) => {
		return render(
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route path="/protected" element={
						<ProtectedRoute role={role}>
							{children}
						</ProtectedRoute>
					} />
					<Route path="/login" element={<div>Login Page</div>} />
				</Routes>
			</MemoryRouter>
		);
	};

	it("renders LoadingScreen with correct loading text when isLoading is true", () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isAuthenticated: false,
			isLoading: true,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>);

		expect(screen.getByText("Verifying authentication...")).toBeInTheDocument();
		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});

	it("redirects to '/login' using Navigate when user is not authenticated", () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>);

		expect(screen.getByText("Login Page")).toBeInTheDocument();
		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});

	it("renders ErrorDisplay when user role does not match required role", () => {
		mockUseAuth.mockReturnValue({
			user: { 
				id: "user-1", 
				name: "Test User", 
				role: "citizen", 
				email: "test@example.com", 
				created_at: "2025-01-01" 
			},
			isAuthenticated: true,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>, "department");

		expect(screen.getByText("This page is not accessible")).toBeInTheDocument();
		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});

	it("passes correct props to ErrorDisplay (message, buttonText, handleClick)", () => {
		mockUseAuth.mockReturnValue({
			user: { 
				id: "user-1", 
				name: "Test User", 
				role: "citizen", 
				email: "test@example.com", 
				created_at: "2025-01-01" 
			},
			isAuthenticated: true,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>, "admin");

		expect(screen.getByText("This page is not accessible")).toBeInTheDocument();
		expect(screen.getByText("Go Home")).toBeInTheDocument();
	});

	it("calls navigate('/') when ErrorDisplay button is clicked", async () => {
		mockUseAuth.mockReturnValue({
			user: { 
				id: "user-1", 
				name: "Test User", 
				role: "citizen", 
				email: "test@example.com", 
				created_at: "2025-01-01" 
			},
			isAuthenticated: true,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>, "department");

		const user = userEvent.setup();
		const button = screen.getByText("Go Home");

		await user.click(button);

		expect(mockNavigate).toHaveBeenCalledWith("/");
	});

	it("renders children when user is authenticated and role matches or is not required", () => {
		mockUseAuth.mockReturnValue({
			user: { 
				id: "user-1", 
				name: "Test User", 
				role: "department", 
				email: "test@example.com", 
				created_at: "2025-01-01" 
			},
			isAuthenticated: true,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>, "department");

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
		expect(screen.queryByText("Verifying authentication...")).not.toBeInTheDocument();
		expect(screen.queryByText("This page is not accessible")).not.toBeInTheDocument();
	});

	it("renders children when no role prop is provided", () => {
		mockUseAuth.mockReturnValue({
			user: { 
				id: "user-1", 
				name: "Test User", 
				role: "citizen", 
				email: "test@example.com", 
				created_at: "2025-01-01" 
			},
			isAuthenticated: true,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>);

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
		expect(screen.queryByText("Verifying authentication...")).not.toBeInTheDocument();
		expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
		expect(screen.queryByText("This page is not accessible")).not.toBeInTheDocument();
	});

	it("does not render LoadingScreen, Navigate, or ErrorDisplay when user is valid", () => {
		mockUseAuth.mockReturnValue({
			user: { 
				id: "user-1", 
				name: "Test User", 
				role: "admin", 
				email: "test@example.com", 
				created_at: "2025-01-01" 
			},
			isAuthenticated: true,
			isLoading: false,
			error: null
		});

		renderProtectedRoute(<div>Protected Content</div>, "admin");

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
		
		expect(screen.queryByText("Verifying authentication...")).not.toBeInTheDocument();
		expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
		expect(screen.queryByText("This page is not accessible")).not.toBeInTheDocument();
	});
});
