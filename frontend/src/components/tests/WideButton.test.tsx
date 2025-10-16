import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WideButton from "../WideButton";

describe("WideButton tests", () => {
    it("Button basic rendering", () => {
        const { container } = render(<WideButton text={"Login"} isLoading={false} isSubmit={false} />);

        const button = container.querySelector("button");
        const buttonDiv = screen.getByText("Login");

        expect(button).toBeInTheDocument();
        expect(buttonDiv).toBeInTheDocument();
    });

    it("Button style checking", () => {
        const { container } = render(<WideButton text={"Login"} isLoading={false} isSubmit={false} />);

        const button = container.querySelector("button");
        
        expect(button).toHaveClass("w-full", "flex", "justify-center", "rounded-md", "bg-indigo-600");
    });

    it("Button renders loading spinner in loading state", () => {
        const { container } = render(<WideButton text={"Submitting..."} isLoading={true} isSubmit={false} />);

        const button = container.querySelector("button");
        const loadingSpinner = button?.querySelector(".animate-spin");

        expect(loadingSpinner).toBeInTheDocument();
    });

    it("Button is disabled in loading state", () => {
        const { container } = render(<WideButton text={"Submitting..."} isLoading={true} isSubmit={false} />);

        const button = container.querySelector("button");
        
        expect(button).toBeDisabled();
    });

    it("Button handles loading state changes gracefully", () => {
        const { container, rerender } = render(<WideButton text={"Submitting..."} isLoading={true} isSubmit={false} />);

        const button = container.querySelector("button");
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();

        rerender(<WideButton text={"Login"} isLoading={false} isSubmit={false} />);
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    it("Button renders as submit type when isSubmit is true", () => {
        const { container } = render(<WideButton text={"Submit"} isSubmit={true} />);

        const button = container.querySelector("button");
        
        expect(button).toHaveAttribute("type", "submit");
    });

    it("Button renders as button type when isSubmit is false", () => {
        const { container } = render(<WideButton text={"Click"} isSubmit={false} />);

        const button = container.querySelector("button");
        
        expect(button).toHaveAttribute("type", "button");
    });

    it("Button defaults to button type when isSubmit is not provided", () => {
        const { container } = render(<WideButton text={"Click"} />);

        const button = container.querySelector("button");
        
        expect(button).toHaveAttribute("type", "button");
    });

    it("Button displays loading text when loading", () => {
        render(<WideButton text={"Login"} isLoading={true} loadingText="Logging in..." />);

        expect(screen.getByText("Logging in...")).toBeInTheDocument();
        expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    it("Button handles no loading text", () => {
        render(<WideButton text={"Login"} isLoading={true} />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    it("Button maintains submit type while loading", () => {
        const { container } = render(<WideButton text={"Submit"} isSubmit={true} isLoading={true} />);

        const button = container.querySelector("button");
        
        expect(button).toHaveAttribute("type", "submit");
        expect(button).toBeDisabled();
    });
});