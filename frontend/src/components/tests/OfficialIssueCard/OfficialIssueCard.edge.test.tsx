import { beforeEach, expect, it, vi } from "vitest";
import type { Department, Issue } from "../../../types/schema";
import { describe } from "node:test";
import { render, screen } from "@testing-library/react";
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

describe("OfficialIssueCard Edge Cases", () => {
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

    it("handles very long titles without breaking layout", () => {
        const longTitle = "This is an extremely long title that should be truncated properly to avoid breaking the card layout and maintain visual consistency across the interface regardless of the content length provided by the user";
        const issueWithLongTitle = { ...mockIssue, title: longTitle };
        
        const { container } = renderCard(issueWithLongTitle);
        
        const titleElement = screen.getByText(longTitle);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveClass("truncate");
        
        const card = container.firstChild as HTMLElement;
        expect(card).toBeInTheDocument();
    });

    it("handles very long descriptions without breaking layout", () => {
        const longDescription = "This is an extremely long description that should be clamped to two lines to maintain a clean and consistent card layout. The description text should be truncated with an ellipsis when it exceeds the maximum allowed lines, ensuring that the card maintains its visual integrity and doesn't expand excessively, which would disrupt the grid or list layout of multiple cards displayed together.";
        const issueWithLongDescription = { ...mockIssue, description: longDescription };
        
        const { container } = renderCard(issueWithLongDescription);
        
        const descriptionElement = screen.getByText(longDescription);
        expect(descriptionElement).toBeInTheDocument();
        expect(descriptionElement).toHaveClass("line-clamp-2");
        
        const card = container.firstChild as HTMLElement;
        expect(card).toBeInTheDocument();
    });

    it("works with missing optional fields (description, photo_url, department)", () => {
        const minimalIssue: Issue & { department?: Department } = {
            id: "minimal-issue",
            title: "Minimal Issue",
            description: undefined,
            status: "new",
            issue_type: "roads_pavements",
            latitude: 12.9716,
            longitude: 77.5946,
            photo_url: undefined,
            created_by: "user-123",
            assigned_department: undefined,
            created_at: "2025-10-14T10:30:00Z",
            updated_at: "2025-10-14T10:30:00Z",
            department: undefined
        };
        
        const { container } = renderCard(minimalIssue);
        
        expect(screen.getByText("Minimal Issue")).toBeInTheDocument();
        
        expect(screen.queryByAltText("Minimal Issue")).not.toBeInTheDocument();
        
        const card = container.firstChild as HTMLElement;
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass("cursor-pointer");
    });

    it("handles coordinate values at edge cases (0, negative, large numbers)", () => {
        const zeroCoords = { ...mockIssue, latitude: 0, longitude: 0 };
        const { rerender } = renderCard(zeroCoords);
        
        expect(screen.getByText("0.0000, 0.0000")).toBeInTheDocument();
        
        const negativeCoords = { ...mockIssue, latitude: -45.8765, longitude: -123.4567 };
        rerender(
            <BrowserRouter>
                <OfficialIssueCard issue={negativeCoords} />
            </BrowserRouter>
        );
        
        expect(screen.getByText("-45.8765, -123.4567")).toBeInTheDocument();
        
        const largeCoords = { ...mockIssue, latitude: 89.9999, longitude: 179.9999 };
        rerender(
            <BrowserRouter>
                <OfficialIssueCard issue={largeCoords} />
            </BrowserRouter>
        );
        
        expect(screen.getByText("89.9999, 179.9999")).toBeInTheDocument();
        
        const preciseCoords = { ...mockIssue, latitude: 12.123456789, longitude: 77.987654321 };
        rerender(
            <BrowserRouter>
                <OfficialIssueCard issue={preciseCoords} />
            </BrowserRouter>
        );
        
        expect(screen.getByText("12.1235, 77.9877")).toBeInTheDocument();
    });

    it("handles missing description gracefully", () => {
        const issueWithoutDesc = { ...mockIssue, description: undefined };
        renderCard(issueWithoutDesc);
        
        expect(screen.getByText("Pothole on Main Street")).toBeInTheDocument();
        
        expect(screen.queryByText("Large pothole causing traffic issues")).not.toBeInTheDocument();
    });

    it("handles missing photo_url gracefully", () => {
        const issueWithoutPhoto = { ...mockIssue, photo_url: undefined };
        renderCard(issueWithoutPhoto);
        
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(0);
    });

    it("handles missing department gracefully", () => {
        const issueWithoutDept = { ...mockIssue, department: undefined, assigned_department: undefined };
        const { container } = renderCard(issueWithoutDept);
        
        const card = container.firstChild as HTMLElement;
        expect(card).toBeInTheDocument();
        
        expect(screen.queryByText("Public Works")).not.toBeInTheDocument();
    });

    it("handles all optional fields as undefined", () => {
        const issueWithUndefined = { 
            ...mockIssue, 
            description: undefined, 
            photo_url: undefined,
            assigned_department: undefined,
            department: undefined
        };
        
        const { container } = renderCard(issueWithUndefined);
        
        const card = container.firstChild as HTMLElement;
        expect(card).toBeInTheDocument();
        expect(screen.getByText("Pothole on Main Street")).toBeInTheDocument();
    });
});
