import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import LoadingScreen from "../LoadingScreen";

describe("LoadingScreen Component", () => {
	describe("Basic Rendering", () => {
		it("should render loading spinner", () => {
			const { container } = render(<LoadingScreen />);

			const spinner = container.querySelector('.animate-spin');
			expect(spinner).toBeInTheDocument();
			expect(spinner).toHaveClass("animate-spin");
			expect(spinner).toHaveClass("border-indigo-600");
		});

		it("should render with default layout", () => {
			const { container } = render(<LoadingScreen />);

			const outerDiv = container.firstChild as HTMLElement;
			expect(outerDiv).toHaveClass("min-h-screen");
			expect(outerDiv).toHaveClass("bg-gray-50");
		});
	});

    describe("Custom Loading text", () => {
        it("should display custom loading text when provided", () => {
            render(<LoadingScreen loadingText="Loading user data..." />);

            const paraTag = screen.getByText("Loading user data...");
            expect(paraTag).toBeInTheDocument();
            expect(paraTag).toHaveClass("text-gray-600");
        });

        it("Should render without text when loadingText is undefined", () => {
            const { container } = render(<LoadingScreen />);

            const paraTag = container.querySelector("p");
            expect(paraTag).toBeInTheDocument();
            expect(paraTag?.textContent).toBe("");

            // checking if layout is intact
            expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
        });

        it("Should handle empty string loadingText", () => {
            const { container } = render(<LoadingScreen loadingText="" />);

            const paraTag = container.querySelector("p");
            expect(paraTag).toBeInTheDocument();
            expect(paraTag?.textContent).toBe("");

            // checking if layout is intact
            expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
        })
    });

    describe("Edge Cases", () => {
        it("Should handle very long loading text", () => {
            const longText = "Loading ".repeat(50) + "please wait...";
            const { container } = render(<LoadingScreen loadingText={longText} />);

            const paraTag = screen.getByText(longText);
            expect(paraTag).toBeInTheDocument();
            
            // checking if layout is intact
            expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
            expect(container.querySelector(".animate-spin")).toBeInTheDocument();
        });

        it("should render correctly with special characters", () => {
			const specialText = "Loading 🚀 data... © ® ™";
			render(<LoadingScreen loadingText={specialText} />);

			const textElement = screen.getByText(specialText);
			expect(textElement).toBeInTheDocument();
			expect(textElement.textContent).toBe(specialText);
		});

		it("should handle unicode characters", () => {
			const unicodeText = "加载中...";
			render(<LoadingScreen loadingText={unicodeText} />);

			const textElement = screen.getByText(unicodeText);
			expect(textElement).toBeInTheDocument();
			expect(textElement.textContent).toBe(unicodeText);
		});

		it("should handle HTML-like strings without rendering as HTML", () => {
			const htmlString = "<script>alert('test')</script>";
			render(<LoadingScreen loadingText={htmlString} />);

			const textElement = screen.getByText(htmlString);
			expect(textElement).toBeInTheDocument();
			expect(textElement.innerHTML).not.toContain("<script>");
		});

        describe("Multiple Instances", () => {
            it("should render multiple loading screens independently", () => {
                const { rerender } = render(<LoadingScreen loadingText="First" />);
                expect(screen.getByText("First")).toBeInTheDocument();

                rerender(<LoadingScreen loadingText="Second" />);
                expect(screen.getByText("Second")).toBeInTheDocument();
                expect(screen.queryByText("First")).not.toBeInTheDocument();
            });
        });

        describe("Props validation", () => {
            it("should handle changing loadingText props", () => {
                const { rerender } = render(<LoadingScreen loadingText="Initial" />);
                expect(screen.getByText("Initial")).toBeInTheDocument();

                rerender(<LoadingScreen loadingText="Final" />);
                expect(screen.getByText("Final")).toBeInTheDocument();
                expect(screen.queryByText("Initial")).not.toBeInTheDocument();
            });
        });
    });
});
