import { beforeEach, expect, it, vi } from "vitest";
import type { Department, Issue } from "../../../types/schema";
import { describe } from "node:test";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OfficialIssueCard from "../../OfficialIssueCard";

const mockDepartment: Department = {
    id: "dept-123",
    name: "Public Works",
    description: "Handles infrastructure issues"
};

const mockIssue: Issue & { department?: Department } = {
    id: "issue-123",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "new",
    issue_type: "roads_pavements",
    latitude: 12.9716,
    longitude: 77.5946,
    photo_url: "https://example.com/photo.jpg",
    created_by: "user-123",
    assigned_department: "dept-123",
    created_at: "2025-10-14T10:30:00Z",
    updated_at: "2025-10-14T10:30:00Z",
    department: mockDepartment
};

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockOnStatusChange = vi.fn();

describe("OfficialIssueCard Working tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderCard = (issue = mockIssue, onStatusChange?: (id: string, status: string) => void) => {
        return render(
            <BrowserRouter>
                <OfficialIssueCard issue={issue} onStatusChange={onStatusChange} />
            </BrowserRouter>
        );
    };

    describe("Status dropdown tests", () => {
        it("renders status dropdown when onStatusChange prop exists", () => {
            const { container } = renderCard(mockIssue, mockOnStatusChange);
            
            const dropdown = container.querySelector("select");
            expect(dropdown).toBeInTheDocument();
        });

        it("hides status dropdown when onStatusChange is undefined", () => {
            const { container } = renderCard(mockIssue);
            
            const dropdown = container.querySelector("select");
            expect(dropdown).not.toBeInTheDocument();
        });

        it("dropdown shows correct current status as selected", () => {
            const newIssue = { ...mockIssue, status: "in_progress" as const };
            const { container } = renderCard(newIssue, mockOnStatusChange);
            
            const dropdown = container.querySelector("select") as HTMLSelectElement;
            expect(dropdown).toBeInTheDocument();
            expect(dropdown).toHaveValue("in_progress");
        });

        it("dropdown contains all three options (New, In Progress, Resolved)", () => {
            const { container } = renderCard(mockIssue, mockOnStatusChange);
            
            const dropdown = container.querySelector("select");
            const options = dropdown?.querySelectorAll("option");
            
            expect(options).toHaveLength(3);
            expect(options?.[0]).toHaveValue("new");
            expect(options?.[1]).toHaveValue("in_progress");
            expect(options?.[2]).toHaveValue("resolved");
            
            expect(options?.[0].textContent).toBe("New");
            expect(options?.[1].textContent).toBe("In Progress");
            expect(options?.[2].textContent).toBe("Resolved");
        });

        it("calls onStatusChange with correct issueId and newStatus when changed", () => {
            const { container } = renderCard(mockIssue, mockOnStatusChange);
            
            const dropdown = container.querySelector("select") as HTMLSelectElement;
            expect(dropdown).toBeInTheDocument();
            
            dropdown.value = "resolved";
            dropdown.dispatchEvent(new Event("change", { bubbles: true }));
            
            expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
            expect(mockOnStatusChange).toHaveBeenCalledWith("issue-123", "resolved");
        });
    });

    describe("Navigation tests", () => {
        it("Navigates to `/issue/:id` when card is clicked", () => {
            const { container } = renderCard(mockIssue, mockOnStatusChange);

            const card = container.firstChild as HTMLElement;

            fireEvent.click(card);

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith(`/issue/${mockIssue.id}`);
        });

        it("Uses correct issue ID in navigation URL", () => {
            const { container } = renderCard({...mockIssue, id: 'issue-456'}, mockOnStatusChange);

            const card = container.firstChild as HTMLElement;
            
            fireEvent.click(card);

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith("/issue/issue-456");
        })

        it("Card has cursor-pointer class for visual feedback", () => {
            const { container } = renderCard(mockIssue, mockOnStatusChange);

            const card = container.firstChild as HTMLElement;

            expect(card).toHaveClass("cursor-pointer");
        });

        it("Card has hover state", () => {
            const { container } = renderCard(mockIssue, mockOnStatusChange);

            const card = container.firstChild as HTMLElement;

            expect(card).toHaveClass("hover:bg-gray-50");
        });
    });
});