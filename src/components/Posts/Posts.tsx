import { Community } from "@/atoms/communityAtom";
import { Post } from "@/atoms/PostAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";

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
  const getPosts = async () => {
    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);

      // extract posts from postDocs
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("Get posts error: ", error.message);
    }
  };

  React.useEffect(() => {
    getPosts();
  }, []);

  return (
    <Stack>
      {postStateValue.posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          userIsCreator={user?.uid === post.creatorId}
          userVoteValue={undefined}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </Stack>
  );
};

export default Posts;
