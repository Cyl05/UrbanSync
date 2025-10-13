import React from 'react';
import { FaBullhorn } from "react-icons/fa";
import type { DepartmentUpdate, User, Department } from "../../types/schema";

interface DepartmentUpdatesProps {
	updates: Array<DepartmentUpdate & { userByAuthorId?: User & { department?: Department } }>;
	formatDate: (dateString: string) => string;
}

const DepartmentUpdates: React.FC<DepartmentUpdatesProps> = ({ updates, formatDate }) => {
	if (!updates || updates.length === 0) {
		return null;
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 mb-5">
			<h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<FaBullhorn className="text-blue-500" /> Department Updates
			</h2>
			<div className="space-y-4">
				{updates.map((update) => {console.log(update.user.department.name); return (
					<div
						key={update.id}
						className="bg-blue-50 px-5 py-4 rounded-lg border-l-4 border-blue-500"
					>
						<div className="flex items-start justify-between mb-2 pb-2 border-b border-blue-200">
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-gray-900">
										{update.user?.name || "Unknown User"}
									</span>
                                    <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-medium">
                                        {update.user.department.name}
                                    </span>
								</div>
								{update.userByAuthorId?.role && (
									<span className="text-xs text-gray-500">
										{update.userByAuthorId.role}
									</span>
								)}
							</div>
							<span className="text-sm text-gray-500 whitespace-nowrap ml-4">
								{formatDate(update.created_at)}
							</span>
						</div>
						<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
							{update.content}
						</p>
					</div>
				)})}
			</div>
		</div>
	);
};

export default DepartmentUpdates;
