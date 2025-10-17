import { afterEach, vi } from "vitest"; 
import { cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/vitest'
import React from "react";
import type { Issue } from "../src/types/schema";

afterEach(() => {
    cleanup();
})

// Common test data - these can be exported
export const mockUser = {
	id: "test-user-id",
	name: "Test User",
	email: "test@example.com",
	role: "citizen" as const,
	created_at: "2025-01-01T00:00:00Z",
};

export const mockIssues = [
	{
		id: "issue-1",
		title: "Pothole on Main Street",
		description: "Large pothole causing traffic issues",
		latitude: 12.9716,
		longitude: 77.5946,
		photo_url: "https://example.com/photo1.jpg",
		status: "new",
		issue_type: "roads_pavements",
	},
	{
		id: "issue-2",
		title: "Broken streetlight",
		description: "Streetlight not working",
		latitude: 12.9656,
		longitude: 77.5946,
		photo_url: null,
		status: "in_progress",
		issue_type: "street_lighting",
	},
];

// Hoisted mocks - these are used in vi.mock calls
const mockUseQuery = vi.fn();
const mockUseNavigate = vi.fn();
const mockUseAuth = vi.fn();
const mockSetView = vi.fn();
const mockGetCenter = vi.fn(() => ({ lat: 12.97914, lng: 77.61112 }));
const mockUseMapEvents = vi.fn();

// Export the mock functions
export { mockUseQuery, mockUseNavigate, mockUseAuth, mockSetView, mockGetCenter, mockUseMapEvents };

// Mock Apollo Client
vi.mock("@apollo/client/react", async () => {
	const actual = await vi.importActual("@apollo/client/react");
	return {
		...actual,
		useQuery: mockUseQuery,
		useMutation: vi.fn(() => [
			vi.fn(),
			{ loading: false, error: undefined },
		]),
	};
});

// Mock React Router
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockUseNavigate,
	};
});

// Mock useAuth hook
vi.mock("../src/hooks/useAuth", () => ({
	useAuth: mockUseAuth,
}));

// Mock React Leaflet
vi.mock("react-leaflet", () => ({
	MapContainer: ({
		children,
		center,
		zoom,
	}: {
		children: React.ReactNode;
		center: [number, number];
		zoom: number;
	}) => (
		<div
			data-testid="map-container"
			data-center={JSON.stringify(center)}
			data-zoom={zoom}
		>
			{children}
		</div>
	),
	TileLayer: ({ url }: { url: string }) => (
		<div data-testid="tile-layer" data-url={url} />
	),
	Marker: ({
		children,
		position,
	}: {
		children: React.ReactNode;
		position: [number, number];
	}) => (
		<div data-testid="marker" data-position={JSON.stringify(position)}>
			{children}
		</div>
	),
	Popup: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="popup">{children}</div>
	),
	ZoomControl: ({ position }: { position: string }) => (
		<div data-testid="zoom-control" data-position={position} />
	),
	useMap: () => ({
		setView: mockSetView,
		getZoom: vi.fn(() => 16),
		getCenter: mockGetCenter,
		on: vi.fn(),
		off: vi.fn(),
	}),
	useMapEvents: mockUseMapEvents,
}));

// Mock MapHeader
vi.mock("../src/features/MapHeader", () => ({
	default: ({
		displaySidebar,
		setDisplaySidebar,
		handlePlaceSelect,
		isMapPinMode,
		setIsMapPinMode,
		mapCenterCoords,
	}: {
		displaySidebar: boolean;
		setDisplaySidebar: (value: boolean) => void;
		handlePlaceSelect: (place: {
			properties: {
				formatted?: string;
				address_line1?: string;
				lat: number;
				lon: number;
			};
		}) => void;
		isMapPinMode: boolean;
		setIsMapPinMode: (value: boolean) => void;
		mapCenterCoords: { latitude: number; longitude: number };
	}) => (
		<div data-testid="map-header">
			<div data-testid="display-sidebar">{displaySidebar.toString()}</div>
			<div data-testid="is-map-pin-mode">{isMapPinMode.toString()}</div>
			<div data-testid="map-center-coords">
				{JSON.stringify(mapCenterCoords)}
			</div>
			<button onClick={() => setDisplaySidebar(!displaySidebar)}>
				Toggle Sidebar
			</button>
			<button onClick={() => setIsMapPinMode(!isMapPinMode)}>
				Toggle Pin Mode
			</button>
			<button
				onClick={() =>
					handlePlaceSelect({
						properties: { lat: 13.0, lon: 78.0 },
					})
				}
			>
				Select Place
			</button>
		</div>
	),
}));

// Mock MapCenterTracker
vi.mock("../src/features/MapCenterTracker", () => ({
	default: ({
		onCenterChange,
	}: {
		onCenterChange: (lat: number, lng: number) => void;
	}) => (
		<div data-testid="map-center-tracker">
			<button onClick={() => onCenterChange(13.5, 78.5)}>
				Update Center
			</button>
		</div>
	),
}));

// Mock CenterMarker
vi.mock("../src/features/CenterMarker", () => ({
	default: () => <div data-testid="center-marker">Center Marker</div>,
}));

// Mock IssueCard
vi.mock("../src/features/IssueCard", () => ({
	IssueCard: ({ issue }: { issue: Issue }) => (
		<div data-testid="issue-card">{issue.title}</div>
	),
}));