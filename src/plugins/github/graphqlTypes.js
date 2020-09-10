// @flow

// Autogenerated file. Do not edit.

import deepFreeze from "deep-freeze";

export type Actor = Bot | Organization | User;

export type Blob = {|
  +__typename: "Blob",
  +id: string,
  +oid: GitObjectID,
|};

export type Bot = {|
  +__typename: "Bot",
  +id: string,
  +login: String,
  +url: URI,
|};

export type Commit = {|
  +__typename: "Commit",
  +author: null | {|
    +date: null | GitTimestamp,
    +user: null | Bot | User,
  |},
  +authoredDate: GitTimestamp,
  +id: string,
  +message: String,
  +oid: GitObjectID,
  +parents: $ReadOnlyArray<null | Commit>,
  +url: URI,
|};

export type DateTime = string;

export type GitObject = Blob | Commit | Tag | Tree;

export type GitObjectID = string;

export type GitTimestamp = string;

export type Int = number;

export type Issue = {|
  +__typename: "Issue",
  +author: null | Actor,
  +body: String,
  +comments: $ReadOnlyArray<null | IssueComment>,
  +createdAt: DateTime,
  +id: string,
  +number: Int,
  +reactions: $ReadOnlyArray<null | Reaction>,
  +title: String,
  +url: URI,
|};

export type IssueComment = {|
  +__typename: "IssueComment",
  +author: null | Actor,
  +body: String,
  +createdAt: DateTime,
  +id: string,
  +reactions: $ReadOnlyArray<null | Reaction>,
  +url: URI,
|};

export type Organization = {|
  +__typename: "Organization",
  +id: string,
  +login: String,
  +url: URI,
|};

export type PullRequest = {|
  +__typename: "PullRequest",
  +additions: Int,
  +author: null | Actor,
  +baseRefName: String,
  +body: String,
  +comments: $ReadOnlyArray<null | IssueComment>,
  +createdAt: DateTime,
  +deletions: Int,
  +id: string,
  +mergeCommit: null | Commit,
  +number: Int,
  +reactions: $ReadOnlyArray<null | Reaction>,
  +reviews: $ReadOnlyArray<null | PullRequestReview>,
  +title: String,
  +url: URI,
|};

export type PullRequestReview = {|
  +__typename: "PullRequestReview",
  +author: null | Actor,
  +body: String,
  +comments: $ReadOnlyArray<null | PullRequestReviewComment>,
  +createdAt: DateTime,
  +id: string,
  +state: PullRequestReviewState,
  +url: URI,
|};

export type PullRequestReviewComment = {|
  +__typename: "PullRequestReviewComment",
  +author: null | Actor,
  +body: String,
  +createdAt: DateTime,
  +id: string,
  +reactions: $ReadOnlyArray<null | Reaction>,
  +url: URI,
|};

export type PullRequestReviewState =
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "COMMENTED"
  | "DISMISSED"
  | "PENDING";

export const PullRequestReviewState$Values: {|
  +"APPROVED": "APPROVED",
  +"CHANGES_REQUESTED": "CHANGES_REQUESTED",
  +"COMMENTED": "COMMENTED",
  +"DISMISSED": "DISMISSED",
  +"PENDING": "PENDING",
|} = deepFreeze({
  "APPROVED": "APPROVED",
  "CHANGES_REQUESTED": "CHANGES_REQUESTED",
  "COMMENTED": "COMMENTED",
  "DISMISSED": "DISMISSED",
  "PENDING": "PENDING",
});

export type Reaction = {|
  +__typename: "Reaction",
  +content: ReactionContent,
  +createdAt: DateTime,
  +id: string,
  +user: null | Organization | User,
|};

export type ReactionContent =
  | "CONFUSED"
  | "EYES"
  | "HEART"
  | "HOORAY"
  | "LAUGH"
  | "ROCKET"
  | "THUMBS_DOWN"
  | "THUMBS_UP";

export const ReactionContent$Values: {|
  +"CONFUSED": "CONFUSED",
  +"EYES": "EYES",
  +"HEART": "HEART",
  +"HOORAY": "HOORAY",
  +"LAUGH": "LAUGH",
  +"ROCKET": "ROCKET",
  +"THUMBS_DOWN": "THUMBS_DOWN",
  +"THUMBS_UP": "THUMBS_UP",
|} = deepFreeze({
  "CONFUSED": "CONFUSED",
  "EYES": "EYES",
  "HEART": "HEART",
  "HOORAY": "HOORAY",
  "LAUGH": "LAUGH",
  "ROCKET": "ROCKET",
  "THUMBS_DOWN": "THUMBS_DOWN",
  "THUMBS_UP": "THUMBS_UP",
});

export type Ref = {|
  +__typename: "Ref",
  +id: string,
  +target: null | GitObject,
|};

export type Repository = {|
  +__typename: "Repository",
  +createdAt: DateTime,
  +defaultBranchRef: null | Ref,
  +id: string,
  +issues: $ReadOnlyArray<null | Issue>,
  +name: String,
  +owner: null | RepositoryOwner,
  +pullRequests: $ReadOnlyArray<null | PullRequest>,
  +url: URI,
|};

export type RepositoryOwner = Organization | User;

export type String = string;

export type Tag = {|
  +__typename: "Tag",
  +id: string,
  +oid: GitObjectID,
|};

export type Tree = {|
  +__typename: "Tree",
  +id: string,
  +oid: GitObjectID,
|};

export type URI = string;

export type User = {|
  +__typename: "User",
  +id: string,
  +login: String,
  +url: URI,
|};
