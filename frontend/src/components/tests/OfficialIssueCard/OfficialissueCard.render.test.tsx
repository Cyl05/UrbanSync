import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import OfficialIssueCard from "../../OfficialIssueCard";
import type { Issue, Department } from "../../../types/schema";

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

describe("OfficialIssueCard Tests", () => {
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

    it("renders card with all basic information", () => {
        renderCard();
        
        expect(screen.getByText("Pothole on Main Street")).toBeInTheDocument();
        expect(screen.getByText("Large pothole causing traffic issues")).toBeInTheDocument();
    });

    it("displays issue photo when photo_url is provided", () => {
        renderCard();
        
        const img = screen.getByAltText("Pothole on Main Street");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
    });

    it("hides photo section when photo_url is null", () => {
        const issueWithoutPhoto = { ...mockIssue, photo_url: undefined };
        renderCard(issueWithoutPhoto);
        
        expect(screen.queryByAltText("Pothole on Main Street")).not.toBeInTheDocument();
    });

    it("Renders without description when description is null/undefined", () => {
        const issueWithoutDescription = { ...mockIssue, description: undefined };
        renderCard(issueWithoutDescription);

        expect(screen.queryByText("Large pothole causing traffic issues")).not.toBeInTheDocument();
    });

    it("shows correct status badge for all status types", () => {
        const newIssue = { ...mockIssue, status: "new" as const };
        const inProgressIssue = { ...mockIssue, status: "in_progress" as const };
        const resolvedIssue = { ...mockIssue, status: "resolved" as const };
        
        const { rerender } = renderCard(newIssue);
        expect(screen.getByText("New")).toBeInTheDocument();

        rerender(
            <BrowserRouter>
                <OfficialIssueCard issue={inProgressIssue} />
            </BrowserRouter>
        );
        expect(screen.getByText("In Progress")).toBeInTheDocument();

        rerender(
            <BrowserRouter>
                <OfficialIssueCard issue={resolvedIssue} />
            </BrowserRouter>
        );
        expect(screen.getByText("Resolved")).toBeInTheDocument();
    });
});