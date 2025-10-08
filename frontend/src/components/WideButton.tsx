import React from "react";

interface WideButtonProps {
	isLoading?: boolean;
	text: string;
    isSubmit?: boolean;
}

const WideButton: React.FC<WideButtonProps> = ({ isLoading, text, isSubmit }) => {
	return (
		<button
			type={isSubmit ? "submit" : "button"}
			disabled={isLoading && isLoading}
			className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
		>
			{isLoading && isLoading ? (
				<div className="flex items-center">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
					Creating account...
				</div>
			) : (
				text
			)}
		</button>
	);
};

export default WideButton;
