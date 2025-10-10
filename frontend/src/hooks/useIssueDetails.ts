import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Issue, User, Department, Comment, Attachment } from "../types/schema";

export const GET_ISSUE_DETAILS = gql`
  query GetIssueDetails($id: uuid!) {
    issues_by_pk(id: $id) {
      id
      title
      description
      status
      issue_type
      latitude
      longitude
      photo_url
      created_at
      updated_at
      created_by
      assigned_department
      assigned_official
      userByCreatedBy {
        id
        name
        email
        role
      }
      department {
        id
        name
        description
      }
      user {
        id
        name
        email
        role
      }
      comments(order_by: { created_at: desc }) {
        id
        content
        public
        created_at
        user {
          id
          name
          role
        }
      }
      attachments(order_by: { created_at: asc }) {
        id
        url
        created_at
        user {
          id
          name
        }
      }
    }
  }
`;

export interface IssueDetailData {
  issues_by_pk: Issue & {
    userByCreatedBy?: User;
    department?: Department;
    user?: User;
    comments: Array<Comment & { user?: User }>;
    attachments: Array<Attachment & { user?: User }>;
  };
}

export const useIssueDetails = (id: string | undefined) => {
  return useQuery<IssueDetailData>(GET_ISSUE_DETAILS, {
    variables: { id },
    skip: !id,
  });
};
