import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import Map from "../../Map";
import { mockUseQuery, mockUseAuth, mockUser } from "../../../../tests/setup";

describe("Map - Interactions", () => {
	beforeEach(() => {
		mockUseAuth.mockReturnValue({
			user: mockUser,
			isAuthenticated: true,
			isLoading: false,
		});
	});

	describe("Props and State Management", () => {
		it("passes correct props to MapHeader (displaySidebar, setDisplaySidebar, etc.)", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const mapHeader = screen.getByTestId("map-header");

			expect(
				within(mapHeader).getByTestId("display-sidebar")
			).toHaveTextContent("false");
			expect(
				within(mapHeader).getByTestId("is-map-pin-mode")
			).toHaveTextContent("false");
			expect(
				within(mapHeader).getByTestId("map-center-coords")
			).toHaveTextContent(
				JSON.stringify({ latitude: 12.97914, longitude: 77.61112 })
			);

			fireEvent.click(within(mapHeader).getByText("Toggle Sidebar"));
			expect(
				within(mapHeader).getByTestId("display-sidebar")
			).toHaveTextContent("true");

			fireEvent.click(within(mapHeader).getByText("Toggle Pin Mode"));
			expect(
				within(mapHeader).getByTestId("is-map-pin-mode")
			).toHaveTextContent("true");
		});
	});

	describe("Conditional Rendering", () => {
		it("renders ZoomControl only when displaySidebar is false", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			expect(screen.getByTestId("zoom-control")).toBeInTheDocument();
			expect(screen.getByTestId("zoom-control")).toHaveAttribute(
				"data-position",
				"bottomright"
			);

			fireEvent.click(screen.getByText("Toggle Sidebar"));

			expect(screen.queryByTestId("zoom-control")).not.toBeInTheDocument();
		});

		it("renders MapCenterTracker only when displaySidebar and isMapPinMode are true", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			expect(
				screen.queryByTestId("map-center-tracker")
			).not.toBeInTheDocument();

			fireEvent.click(screen.getByText("Toggle Sidebar"));
			expect(
				screen.queryByTestId("map-center-tracker")
			).not.toBeInTheDocument();

			fireEvent.click(screen.getByText("Toggle Pin Mode"));
			expect(screen.getByTestId("map-center-tracker")).toBeInTheDocument();

			fireEvent.click(screen.getByText("Toggle Sidebar"));
			expect(
				screen.queryByTestId("map-center-tracker")
			).not.toBeInTheDocument();
		});

		it("renders CenterMarker when displaySidebar and isMapPinMode are true", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			expect(screen.queryByTestId("center-marker")).not.toBeInTheDocument();

			fireEvent.click(screen.getByText("Toggle Sidebar"));
			expect(screen.queryByTestId("center-marker")).not.toBeInTheDocument();

			// Enable pin mode
			fireEvent.click(screen.getByText("Toggle Pin Mode"));
			expect(screen.getByTestId("center-marker")).toBeInTheDocument();

			fireEvent.click(screen.getByText("Toggle Pin Mode"));
			expect(screen.queryByTestId("center-marker")).not.toBeInTheDocument();
		});
	});

	describe("Coordinate Updates", () => {
		it("updates centerCoords when handleMapCenterChange is called and not programmatic", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			fireEvent.click(screen.getByText("Toggle Sidebar"));
			fireEvent.click(screen.getByText("Toggle Pin Mode"));

			const mapHeader = screen.getByTestId("map-header");
			const initialCoords =
				within(mapHeader).getByTestId("map-center-coords");
			expect(initialCoords).toHaveTextContent(
				JSON.stringify({ latitude: 12.97914, longitude: 77.61112 })
			);

			const centerTracker = screen.getByTestId("map-center-tracker");
			fireEvent.click(within(centerTracker).getByText("Update Center"));

			expect(
				within(mapHeader).getByTestId("map-center-coords")
			).toHaveTextContent(
				JSON.stringify({ latitude: 13.5, longitude: 78.5 })
			);
		});

		it("does not update centerCoords when isProgrammaticMove is true", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const mapHeader = screen.getByTestId("map-header");

			fireEvent.click(within(mapHeader).getByText("Select Place"));

			expect(
				within(mapHeader).getByTestId("map-center-coords")
			).toHaveTextContent(
				JSON.stringify({ latitude: 13.0, longitude: 78.0 })
			);

			fireEvent.click(screen.getByText("Toggle Sidebar"));
			fireEvent.click(screen.getByText("Toggle Pin Mode"));
		});

		it("handlePlaceSelect updates centerCoords and tempMarker correctly", () => {
			mockUseQuery.mockReturnValue({
				data: { issues: [] },
				loading: false,
				error: undefined,
			});

			render(<Map />);

			const mapHeader = screen.getByTestId("map-header");
			const initialCoords =
				within(mapHeader).getByTestId("map-center-coords");
			expect(initialCoords).toHaveTextContent(
				JSON.stringify({ latitude: 12.97914, longitude: 77.61112 })
			);

			fireEvent.click(within(mapHeader).getByText("Select Place"));

			expect(
				within(mapHeader).getByTestId("map-center-coords")
			).toHaveTextContent(
				JSON.stringify({ latitude: 13.0, longitude: 78.0 })
			);

		});
	});
});
