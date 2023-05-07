import { Post, postState } from "@/atoms/PostAtom";
import { firestore } from "@/firebase/clientApp";
import { Box, Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import React from "react";
import { useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  commentText: string;
  createdAt: Timestamp;
};

const Comments = ({ user, selectedPost, communityId }: CommentsProps) => {
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = React.useState(false);
  const [creatingComment, setCreatingComment] = React.useState(false);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    setCreatingComment(true);
    try {
      const batch = writeBatch(firestore);
      // create a comment document

      const commentDocRef = doc(collection(firestore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        commentText: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      // update the post's number of comments
      const postDocRef = doc(firestore, "posts", selectedPost?.id as string);

      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update state to show new comment and number of comments - state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.error("onCreateComment error", error);
    }
    setCreatingComment(false);
  };

  const onDeleteComment = async (comment: any) => {
    // delete a comment document
    // update the post's number of comments
    // update state to show new comment and number of comments - state
  };

  const getPostComments = async () => {};

  React.useEffect(() => {
    getPostComments();
  }, []);
  return (
    <Box background={"white"} borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction={"column"}
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width={"100%"}
      >
        {/* comment input */}
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          creatingComment={creatingComment}
          onCreateComment={onCreateComment}
        />
      </Flex>
    </Box>
  );
};

export default Comments;
