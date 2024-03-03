import * as Ids from "./ids";

export interface Comments {
  comments: Record<
    Ids.Comment,
    {
      id: Ids.Comment;
      parentId: Ids.Comment | null;
      level: number;
      timePublished: string;
      timeChanged: null;
      isSuspended: false;
      status: "published";
      score: number;
      votesCount: number;
      message: string;
      editorVersion: 1;
      author: {
        id: Ids.User;
        alias: string;
        fullname: string;
        avatarUrl: string;
        speciality: "Publisher";
      };
      isAuthor: false;
      isPostAuthor: true;
      isNew: false;
      isFavorite: false;
      isCanEdit: false;
      timeEditAllowedTill: null;
      children: Array<Ids.Comment>;
      vote: { value: null; isCanVote: false };
      isChargeEnough: false;
      isKarmaEnough: false;
      canVotePlus: false;
      canVoteMinus: false;
      isPinned: false;
    }
  >;
  moderated: unknown;
  threads: Array<Ids.Comment>;

  lastCommentTimestamp: number;
  pinnedCommentIds: Array<Ids.Comment>;
}
