// ENUMS
export type UserRole = "citizen" | "official" | "admin";
export type IssueStatus = "new" | "in_progress" | "resolved";
export type AuditAction = "create" | "update" | "delete" | "assign";

// USERS
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  created_at: string;
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
    status: IssueStatus
}

// ISSUES
export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  photo_url?: string;
  created_by: string;              // references User.id
  assigned_department?: string;    // references Department.id
  assigned_official?: string;      // references User.id
  created_at: string;
  updated_at: string;
}

// COMMENTS
export interface Comment {
  id: string;
  issue_id: string;                // references Issue.id
  author_id: string;               // references User.id
  content: string;
  public: boolean;
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
