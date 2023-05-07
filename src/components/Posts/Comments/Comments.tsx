import { Post, postState } from "@/atoms/PostAtom";
import { firestore } from "@/firebase/clientApp";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import React from "react";
import { useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";
import CommentItem, { Comment } from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments = ({ user, selectedPost, communityId }: CommentsProps) => {
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [fetchingComments, setFetchingComments] = React.useState(true);
  const [creatingComment, setCreatingComment] = React.useState(false);
  const [commentDeletedId, setCommentDeletedId] = React.useState("");
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
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

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

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

  const onDeleteComment = async (comment: Comment) => {
    setCommentDeletedId(comment.id);
    try {
      // delete a comment document
      const batch = writeBatch(firestore);

      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update the post's number of comments
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update state to show new comment and number of comments - state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.error("onDeletecommentError", error);
    }
    setCommentDeletedId("");
  };

  const getPostComments = async () => {
    setFetchingComments(true);
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );

      const commentDocs = await getDocs(commentsQuery);

      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments as Comment[]);
    } catch (error) {
      console.error("getPostCommentsError", error);
    }
    setFetchingComments(false);
  };

  React.useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

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
        {!fetchingComments && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            creatingComment={creatingComment}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>

      <Stack spacing={6} p={2}>
        {fetchingComments ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding={6} bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction={"column"}
                justify="center"
                align={"center"}
                borderTop="1px solid"
                borderColor={"gray.100"}
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    deletingComment={commentDeletedId === comment.id}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
