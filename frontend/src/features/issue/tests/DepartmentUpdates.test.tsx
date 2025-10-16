import { describe, expect, it } from "vitest";
import type { DepartmentUpdate, User, Department } from "../../../types/schema";
import { render, screen } from "@testing-library/react";
import { formatDate } from "../../../utils/formatDate";
import DepartmentUpdates from "../DepartmentUpdates";

const mockDepartment: Department = {
    id: "dept-123",
    name: "Public Works Department",
    description: "Handles infrastructure and maintenance"
};

const mockUser: User & { department?: Department } = {
    id: "user-456",
    name: "John Smith",
    email: "john.smith@publicworks.gov",
    role: "department",
    created_at: "2025-01-15T08:00:00Z",
    profile_picture: "https://example.com/avatar/john.jpg",
    department: mockDepartment
};

const mockDepartmentUpdates: Array<DepartmentUpdate & { user?: User & { department?: Department } }> = [
    {
        id: "update-1",
        issue_id: "issue-123",
        author_id: "user-456",
        content: "We have inspected the site and confirmed the issue. Repair crew will be dispatched tomorrow morning.",
        created_at: "2025-10-14T10:30:00Z",
        user: mockUser
    },
    {
        id: "update-2",
        issue_id: "issue-123",
        author_id: "user-456",
        content: "Work in progress. Materials have been procured and the team is on-site.",
        created_at: "2025-10-15T14:15:00Z",
        user: mockUser
    },
    {
        id: "update-3",
        issue_id: "issue-123",
        author_id: "user-456",
        content: "Repairs completed successfully. Quality inspection passed. Issue resolved.",
        created_at: "2025-10-16T09:45:00Z",
        user: mockUser
    }
];

describe("DepartmentUpdates tests", () => {
	const renderComponent = (updates = mockDepartmentUpdates, date = formatDate) => {
        return render(
            <DepartmentUpdates updates={updates} formatDate={date} />
        );
    };

	it("returns null when updates array is empty", () => {
		const { container } = renderComponent([]);

		expect(container.firstChild).toBeNull();
	});

	it("renders component with 'Department Updates' heading and bullhorn icon when updates exist", () => {
		renderComponent();

		expect(screen.getByText("Department Updates")).toBeInTheDocument();
		
		const heading = screen.getByText("Department Updates");
		const icon = heading.parentElement?.querySelector("svg");
		expect(icon).toBeInTheDocument();
	});

	it("renders all updates in the updates array with proper spacing", () => {
		const { container } = renderComponent();

		expect(screen.getByText(mockDepartmentUpdates[0].content)).toBeInTheDocument();
		expect(screen.getByText(mockDepartmentUpdates[1].content)).toBeInTheDocument();
		expect(screen.getByText(mockDepartmentUpdates[2].content)).toBeInTheDocument();

		const updatesContainer = container.querySelector(".space-y-4");
		expect(updatesContainer).toBeInTheDocument();
	});

	it("each update card has blue-themed styling with left border accent", () => {
		const { container } = renderComponent();

		const updateCards = container.querySelectorAll(".bg-indigo-50");
		expect(updateCards.length).toBe(3);

		const firstCard = updateCards[0];
		expect(firstCard).toHaveClass("border-l-4", "border-indigo-500");
	});

	it("displays user profile picture, name, and department badge correctly", () => {
		renderComponent();

		const profileImg = screen.getAllByAltText("John Smith");
		expect(profileImg).toHaveLength(3);
		expect(profileImg[0]).toHaveAttribute("src", "https://example.com/avatar/john.jpg");

		expect(screen.getAllByText("John Smith")[0]).toBeInTheDocument();

		expect(screen.getAllByText("Public Works Department")[0]).toBeInTheDocument();
	});

	it("shows 'Unknown User' when user name is undefined", () => {
		const userWithoutName = {
			...mockUser,
			name: undefined as unknown as string
		};

		const updatesWithoutUserName = [{
			...mockDepartmentUpdates[0],
			user: userWithoutName
		}];

		renderComponent(updatesWithoutUserName);

		expect(screen.getByText("Unknown User")).toBeInTheDocument();
	});

	it("handles missing profile picture gracefully", () => {
		const updatesWithoutPicture = [{
			...mockDepartmentUpdates[0],
			user: {
				...mockUser,
				profile_picture: undefined
			}
		}];

		renderComponent(updatesWithoutPicture);

		const img = screen.getByAltText("John Smith");
		expect(img).toBeInTheDocument();
	});

	it("handles missing department gracefully", () => {
		const updatesWithoutDept = [{
			...mockDepartmentUpdates[0],
			user: {
				...mockUser,
				department: undefined
			}
		}];

		const { container } = renderComponent(updatesWithoutDept);

		expect(container.firstChild).toBeInTheDocument();
		
		expect(screen.queryByText("Public Works Department")).not.toBeInTheDocument();
	});

	it("handles updates with missing user relationship", () => {
		const updatesWithoutUser = [{
			...mockDepartmentUpdates[0],
			user: undefined
		}];

		renderComponent(updatesWithoutUser);

		expect(screen.getByText("Unknown User")).toBeInTheDocument();
		
		expect(screen.getByText(mockDepartmentUpdates[0].content)).toBeInTheDocument();
	});

	it("works with minimal update data", () => {
		const minimalUpdate: Array<DepartmentUpdate & { user?: User & { department?: Department } }> = [{
			id: "minimal-1",
			issue_id: "issue-123",
			author_id: "user-456",
			content: "Minimal update content",
			created_at: "2025-10-14T10:30:00Z"
		}];

		renderComponent(minimalUpdate);

		expect(screen.getByText("Minimal update content")).toBeInTheDocument();
		expect(screen.getByText("Unknown User")).toBeInTheDocument();
	});

	it("handles very long update content without breaking layout", () => {
		const longContent = "Hello".repeat(100);
		
		const updateWithLongContent = [{
			...mockDepartmentUpdates[0],
			content: longContent
		}];

		renderComponent(updateWithLongContent);

		expect(screen.getByText(longContent.trim())).toBeInTheDocument();
		
		const contentElement = screen.getByText(longContent);
		expect(contentElement).toHaveClass("whitespace-pre-wrap");
	});
});