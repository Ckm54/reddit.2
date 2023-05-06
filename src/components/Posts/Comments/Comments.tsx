import { Post } from "@/atoms/PostAtom";
import { Box, Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import CommentInput from "./CommentInput";

type CommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

const Comments = ({ user, selectedPost, communityId }: CommentsProps) => {
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState([]);
  const [fetchLoading, setFetchLoading] = React.useState(false);
  const [creatingComment, setCreatingComment] = React.useState(false);

  const onCreateComment = async (commentText: string) => {};

  const onDeleteComment = async (comment: any) => {};

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
