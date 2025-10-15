import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorDisplay from "../ErrorDisplay";

describe("ErrorDisplay", () => {
	it("renders error message correctly", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Something went wrong"
				handleClick={mockHandleClick}
				buttonText="Try Again"
			/>
		);

		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});

	it("renders button with correct text", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Error occurred"
				handleClick={mockHandleClick}
				buttonText="Go Back"
			/>
		);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Go Back");
	});

	it("renders error heading", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="Retry"
			/>
		);

		expect(screen.getByRole("heading")).toBeInTheDocument();
	});

	it("renders warning emoji", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="Retry"
			/>
		);

		expect(screen.getByText("⚠️")).toBeInTheDocument();
	});

	it("calls handleClick when button is clicked", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="Click Me"
			/>
		);

		const button = screen.getByRole("button", { name: /click me/i });
		fireEvent.click(button);

		expect(mockHandleClick).toHaveBeenCalledTimes(1);
	});

	it("calls handleClick multiple times when button is clicked multiple times", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="Retry"
			/>
		);

		const button = screen.getByRole("button", { name: /retry/i });
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		expect(mockHandleClick).toHaveBeenCalledTimes(3);
	});

	it("applies correct CSS classes for styling", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="Retry"
			/>
		);

		const button = screen.getByRole("button", { name: /retry/i });
		expect(button).toHaveClass("bg-indigo-600");
		expect(button).toHaveClass("text-white");
		expect(button).toHaveClass("hover:bg-indigo-700");
	});

	it("renders with long error message", () => {
		const mockHandleClick = vi.fn();
		const longMessage =
			"Error ".repeat(2);

		render(
			<ErrorDisplay
				message={longMessage}
				handleClick={mockHandleClick}
				buttonText="Retry"
			/>
		);

		expect(screen.getByText(longMessage.trim())).toBeInTheDocument();
	});

	it("renders with empty button text", () => {
		const mockHandleClick = vi.fn();
		render(
			<ErrorDisplay message="Test error" handleClick={mockHandleClick} buttonText="" />
		);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("");
	});

	it("maintains button functionality with different button texts", () => {
		const mockHandleClick = vi.fn();
		const { rerender } = render(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="First Button"
			/>
		);

		let button = screen.getByRole("button", { name: /first button/i });
		fireEvent.click(button);
		expect(mockHandleClick).toHaveBeenCalledTimes(1);

		rerender(
			<ErrorDisplay
				message="Test error"
				handleClick={mockHandleClick}
				buttonText="Second Button"
			/>
		);

		button = screen.getByRole("button", { name: /second button/i });
		fireEvent.click(button);
		expect(mockHandleClick).toHaveBeenCalledTimes(2);
	});
});