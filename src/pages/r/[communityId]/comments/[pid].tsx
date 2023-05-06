import { Post } from "@/atoms/PostAtom";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import { auth } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostDetailsPage = () => {
  const [user] = useAuthState(auth);

  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();

  return (
    <PageContent>
      <>
        {/* selectedPost */}
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (post) => post.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        {/* Comments */}
      </>
      <>{/* About community */}</>
    </PageContent>
  );
};

export default PostDetailsPage;
