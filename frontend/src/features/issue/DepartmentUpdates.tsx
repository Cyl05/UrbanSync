import React from 'react';
import { FaBullhorn } from "react-icons/fa";
import type { DepartmentUpdate, User, Department } from "../../types/schema";

interface DepartmentUpdatesProps {
	updates?: Array<DepartmentUpdate & { user?: User & { department?: Department } }>;
	formatDate: (dateString: string) => string;
}

const DepartmentUpdates: React.FC<DepartmentUpdatesProps> = ({ updates, formatDate }) => {
	if (!updates || updates.length === 0) {
		return null;
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 mb-5" data-testid="department-updates-section">
			<h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<FaBullhorn className="text-indigo-500" /> Department Updates
			</h2>
			<div className="space-y-4">
				{updates.map((update) => (
					<div
						key={update.id}
						className="bg-indigo-50 px-5 py-4 rounded-lg border-l-4 border-indigo-500"
						data-testid="department-update-item"
					>
						<div className="flex mb-2 pb-2 border-b border-indigo-200 items-center">
							<img 
								className="w-6 h-6 rounded-full object-cover" 
								src={update.user?.profile_picture} 
								alt={update.user?.name || "User avatar"}
							/>
							<div className="flex flex-col gap-1 ml-2">
								<div>
									<span className="font-semibold text-gray-900" data-testid="update-author-name">
										{update.user?.name || "Unknown User"}
									</span> <br></br>
                                    <span className="text-xs px-2 py-1 bg-indigo-600 text-white rounded font-medium" data-testid="update-department-badge">
                                        {update.user?.department?.name}
                                    </span>
								</div>
							</div>
							<span className="text-sm text-gray-500 whitespace-nowrap ml-4">
								{formatDate(update.created_at)}
							</span>
						</div>
						<p className="text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="update-content">
							{update.content}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default DepartmentUpdates;
