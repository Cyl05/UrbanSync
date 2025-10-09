import React from "react";
import L from 'leaflet';

const CenterMarker: React.FC = () => {
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none">
				<img
					width="60"
					height="60"
					// viewBox="0 0 40 40"
					src="https://i.ibb.co/Kz834gDZ/image-removebg-preview-5-removebg-preview.png"
					className="drop-shadow-lg"
				/>
		</div>
	);
};

export default CenterMarker;
