// import React from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { IssueMini } from "../types/schema";

interface IssueCardProps {
	issue: IssueMini;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
	return (
		<div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
			{issue?.photo_url
				&& <div className="relative overflow-hidden h-48 bg-gradient-to-br from-emerald-50 to-teal-50">
					<img
						src={issue.photo_url}
						alt="Issue preview"
						className="w-full h-full object-cover"
					/>
				</div>
			}

			<div className="p-6">
				<h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-emerald-700 transition-colors">
					{issue.title}
				</h3>

				<p className="text-gray-600 text-sm leading-relaxed mb-5">
					{issue.description}
				</p>

				<button className="group w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer">
					<span>View Issue</span>
                    <FaArrowUpRightFromSquare />
				</button>
			</div>
		</div>
	);
};
