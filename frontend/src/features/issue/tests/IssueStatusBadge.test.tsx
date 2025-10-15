import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IssueStatusBadge from "../IssueStatusBadge";

describe("Issue Status Badge Tests", () => {
	describe("basic rendering tests", () => {
		it("Should render 'New' badge with correct styling", () => {
			const { container } = render(<IssueStatusBadge status="new" />);

			const badge = container.querySelector("span");
			expect(badge).toBeInTheDocument();
			expect(badge?.textContent.trim()).toBe("New");
			expect(badge).toHaveClass("bg-red-100", "text-red-800");

			expect(badge?.querySelector("svg")).toBeInTheDocument();
		});

		it("Should render 'In Progress' badge with correct styling", () => {
			const { container } = render(<IssueStatusBadge status="in_progress" />);

			const badge = container.querySelector("span");
			expect(badge).toBeInTheDocument();
			expect(badge?.textContent.trim()).toBe("In Progress");
			expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");

			expect(badge?.querySelector("svg")).toBeInTheDocument();
		});

		it("Should render 'Resolved' badge with correct styling", () => {
			const { container } = render(<IssueStatusBadge status="resolved" />);

			const badge = container.querySelector("span");
			expect(badge).toBeInTheDocument();
			expect(badge?.textContent.trim()).toBe("Resolved");
			expect(badge).toHaveClass("bg-green-100", "text-green-800");

			expect(badge?.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("Should handle unknown status gracefully", () => {
			const { container } = render(<IssueStatusBadge status="Loading" />);
			
			const badge = container.querySelector("span");
			expect(badge).toBeInTheDocument();
			expect(badge?.textContent.trim()).toBe("Loading");
			expect(badge).toHaveClass("bg-gray-100", "text-gray-800");
		});
	});

	describe("Accessibility and Styling", () => {
		it("Should have proper inline-flex display", () => {
			const { container } = render(<IssueStatusBadge status="new" />);

			const badge = container.querySelector("span");
			expect(badge).toHaveClass('inline-flex', 'items-center');
		});

		it("Should maintain consistent sizing across statuses", () => {
			const { container: newContainer } = render(<IssueStatusBadge status="new" />);
			const { container: inProgressContainer } = render(<IssueStatusBadge status="in_progress" />);
			const { container: resolvedContainer } = render(<IssueStatusBadge status="resolved" />);

			const newBadge = newContainer.querySelector("span");
			const inProgressBadge = inProgressContainer.querySelector("span");
			const resolvedBadge = resolvedContainer.querySelector("span");

			[newBadge, inProgressBadge, resolvedBadge].forEach((badge) => {
                expect(badge).toHaveClass("px-3", "text-sm", "font-medium");
            });
		})
	});
});
