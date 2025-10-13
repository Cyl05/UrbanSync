import React from "react";

interface ErrorDisplayProps {
	message: string;
	handleClick: () => void;
	buttonText: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, handleClick, buttonText }) => {
	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
			<div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
				<div className="text-red-500 text-5xl mb-4">⚠️</div>
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Map</h2>
				<p className="text-gray-600">{message}</p>
				<button
					onClick={handleClick}
					className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};

export default ErrorDisplay;
