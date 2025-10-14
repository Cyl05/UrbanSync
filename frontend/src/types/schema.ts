// ENUMS
export type UserRole = "citizen" | "department" | "admin";
export type IssueStatus = "new" | "in_progress" | "resolved";
export type AuditAction = "create" | "update" | "delete" | "assign";
export type IssueType =
	| "roads_pavements"
	| "street_lights"
	| "traffic_signals"
	| "water_supply"
	| "drainage_sewerage"
	| "garbage_collection"
	| "illegal_dumping"
	| "air_pollution"
	| "noise_pollution"
	| "tree_issues"
	| "electricity";

// USERS
export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	created_at: string;
	department?: Department;
	profile_picture: string;
}

// DEPARTMENTS
export interface Department {
	id: string;
	name: string;
	description?: string;
}

// HOMEPAGE ISSUE
export interface IssueMini {
	id: string;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
	photo_url?: string;
	status: IssueStatus;
	issue_type?: IssueType;
}

// ISSUES
export interface Issue {
	id: string;
	title: string;
	description?: string;
	status: IssueStatus;
	issue_type: IssueType;
	latitude: number;
	longitude: number;
	photo_url?: string;
	created_by: string;              // references User.id
	assigned_department?: string;    // references Department.id
	created_at: string;
	updated_at: string;
}

// COMMENTS
export interface Comment {
	id: string;
	issue_id: string;                // references Issue.id
	author_id: string;               // references User.id
	content: string;
	created_at: string;
}

// DEPARTMENT UPDATES
export interface DepartmentUpdate {
	id: string;
	issue_id: string;                // references Issue.id
	author_id: string;               // references User.id
	content: string;
	created_at: string;
}

// ATTACHMENTS
export interface Attachment {
	id: string;
	issue_id: string;                // references Issue.id
	url: string;
	uploaded_by?: string;            // references User.id
	created_at: string;
}

// AUDIT LOGS
export interface AuditLog {
	id: string;
	entity: string;
	entity_id: string;
	action: AuditAction;
	performed_by?: string;           // references User.id
	timestamp: string;
}

// ISSUE TYPES
export const IssueCategoryLabels = {
	roads_pavements: 'Roads & Pavements',
	street_lights: 'Street Lights',
	traffic_signals: 'Traffic Signals',
	water_supply: 'Water Supply',
	drainage_sewerage: 'Drainage & Sewerage',
	garbage_collection: 'Garbage Collection',
	illegal_dumping: 'Illegal Dumping',
	air_pollution: 'Air Pollution',
	noise_pollution: 'Noise Pollution',
	tree_issues: 'Tree Issues',
	electricity: 'Electricity'
} as const;
