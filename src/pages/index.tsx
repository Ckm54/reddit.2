import { Post, PostVote } from '@/atoms/PostAtom';
import CreatePostLink from '@/components/Community/CreatePostLink';
import PersonalHome from '@/components/Community/PersonalHome';
import PremiumTrial from '@/components/Community/PremiumTrial';
import Recommendations from '@/components/Community/Recommendations';
import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import PostLoader from '@/components/Posts/PostLoader';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { Stack } from '@chakra-ui/react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { NextPage } from 'next';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = React.useState(false);
  const { communityStateValue } = useCommunityData();
  const {
    setPostStateValue,
    postStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();

  const buildNonAuthUserHomeFeed = React.useCallback(async () => {
    setLoading(true);
    try {
      // fet 10 most popular posts in database
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // update state
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.error('Build non auth user home feed error', error);
    }
    setLoading(false);
  }, [setPostStateValue]);

  const buildAuthUserHomePage = React.useCallback(async () => {
    setLoading(true);
    try {
      // get a set of posts from user's communities -- first 10
      if (communityStateValue.mySnippets.length) {
        const myCommunitiesIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );

        const postsQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunitiesIds),
          limit(10)
        );

        const postsDocs = await getDocs(postsQuery);

        const posts = postsDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        // build a generic feed
        buildNonAuthUserHomeFeed();
      }
    } catch (error) {
      console.error('build auth user feed error', error);
    }
    setLoading(false);
  }, [
    buildNonAuthUserHomeFeed,
    communityStateValue.mySnippets,
    setPostStateValue,
  ]);

  const getUserPostVotes = React.useCallback(async () => {
    try {
      const postIds = postStateValue.posts.map((post: Post) => post.id);

      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      );

      const postVotesDocs = await getDocs(postVotesQuery);

      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.error('get user post votes error:', error);
    }
  }, [postStateValue.posts, setPostStateValue, user?.uid]);

  // useEffects
  React.useEffect(() => {
    if (!user && !loadingUser) buildNonAuthUserHomeFeed();
  }, [user, loadingUser, buildNonAuthUserHomeFeed]);

  React.useEffect(() => {
    if (communityStateValue.snippetsFetched) buildAuthUserHomePage();
  }, [buildAuthUserHomePage, communityStateValue.snippetsFetched]);

  React.useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts, getUserPostVotes, setPostStateValue]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
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
                  postStateValue.postVotes.find(
                    (vote) => vote.postId === post.id
                  )?.voteValue
                }
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5} position="fixed">
        <Recommendations />
        <PremiumTrial />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
};

export default Home;

