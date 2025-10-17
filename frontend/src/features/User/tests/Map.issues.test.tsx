import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import Map from "../../Map";
import { mockUseQuery, mockUseAuth, mockUser, mockIssues } from "../../../../tests/setup";

describe("Map - Issues", () => {
	beforeEach(() => {
		mockUseAuth.mockReturnValue({
			user: mockUser,
			isAuthenticated: true,
			isLoading: false,
		});
	});

	describe("Issue Markers", () => {
		it("renders Marker components for all issues in data", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: mockIssues },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const markers = screen.getAllByTestId("marker");

			expect(markers.length).toBeGreaterThanOrEqual(2);

			const issueMarkers = markers.filter((marker) => {
				const position = marker.getAttribute("data-position");
				return (
					position === JSON.stringify([12.9716, 77.5946]) ||
					position === JSON.stringify([12.9656, 77.5946])
				);
			});

			expect(issueMarkers).toHaveLength(2);
		});

		it("each issue Marker contains an IssueCard inside a Popup", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: mockIssues },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const popups = screen.getAllByTestId("popup");
			expect(popups.length).toBeGreaterThanOrEqual(2);

			const issueCards = screen.getAllByTestId("issue-card");
			expect(issueCards).toHaveLength(2);

			expect(screen.getByText("Pothole on Main Street")).toBeInTheDocument();
			expect(screen.getByText("Broken streetlight")).toBeInTheDocument();
		});
	});
});
