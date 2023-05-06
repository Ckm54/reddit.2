import { Community } from "@/atoms/communityAtom";
import { Post } from "@/atoms/PostAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type Props = {
  communityData: Community;
};

const Posts = ({ communityData }: Props) => {
  // get auth state
  const [user] = useAuthState(auth);
  const [loading, setLoading] = React.useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  React.useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        // get posts for this community
        const postsQuery = query(
          collection(firestore, "posts"),
          where("communityId", "==", communityData.id),
          orderBy("createdAt", "desc")
        );

        const postDocs = await getDocs(postsQuery);

        // extract posts from postDocs
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } catch (error: any) {
        console.log("Get posts error: ", error.message);
      }
      setLoading(false);
    };

    getPosts();
  }, [communityData.id, setPostStateValue]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
