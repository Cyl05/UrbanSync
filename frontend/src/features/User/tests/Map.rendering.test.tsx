import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import Map from "../../Map";
import { mockUseQuery, mockUseAuth, mockUser } from "../../../../tests/setup";

describe("Map - Rendering", () => {
	beforeEach(() => {
		mockUseAuth.mockReturnValue({
			user: mockUser,
			isAuthenticated: true,
			isLoading: false,
		});
	});

	describe("Loading and Error States", () => {
		it("renders LoadingScreen when loading is true", () => {
			mockUseQuery.mockReturnValue({
				data: undefined,
				loading: true,
				error: undefined,
			});

			render(<Map />);

			expect(
				screen.getByText("Loading map and issues...")
			).toBeInTheDocument();
		});

		it("renders ErrorDisplay with 'Reload' button for other error types", () => {
			mockUseQuery.mockReturnValue({
				data: undefined,
				loading: false,
				error: new Error("There was an error"),
			});

			render(<Map />);

			const errortext = screen.getByText("There was an error");
			const button = screen.getByText("Reload");

			expect(errortext).toBeInTheDocument();
			expect(errortext).toHaveClass("text-gray-600");

			expect(button).toBeInTheDocument();
			expect(button).toHaveClass(
				"bg-indigo-600",
				"rounded-lg",
				"hover:bg-indigo-700",
				"cursor-pointer"
			);
		});
	});

	describe("Map Structure", () => {
		it("renders MapHeader component when data is loaded (unauthenticated)", () => {
			mockUseAuth.mockReturnValue({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});

			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			expect(screen.getByTestId("map-header")).toBeInTheDocument();
		});

		it("renders MapContainer with correct initial center and zoom", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const mapContainer = screen.getByTestId("map-container");
			expect(mapContainer).toBeInTheDocument();
			expect(mapContainer).toHaveAttribute(
				"data-center",
				JSON.stringify([12.97914, 77.61112])
			);
			expect(mapContainer).toHaveAttribute("data-zoom", "16");
		});

		it("renders three TileLayer components with correct URLs", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const tileLayers = screen.getAllByTestId("tile-layer");
			expect(tileLayers).toHaveLength(3);

			expect(tileLayers[0]).toHaveAttribute(
				"data-url",
				"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
			);
			expect(tileLayers[1]).toHaveAttribute(
				"data-url",
				"https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
			);
			expect(tileLayers[2]).toHaveAttribute(
				"data-url",
				"https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
			);
		});
	});
});
