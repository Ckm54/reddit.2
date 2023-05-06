import { authModalState } from "@/atoms/authModalAtom";
import { communityState } from "@/atoms/communityAtom";
import { Post, postState, PostVote } from "@/atoms/PostAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    //Check if user is unauthenticated then open auth modal

    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;

    // check if there is an existing vote
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );

    try {
      // if new vote change vote ---- add or subtract one - create a new postVote document
      // else ::: user removing vote --- delete postVote document
      // else ::: user flipping vote eg upvote a downvote vice versa -- add or subtract 2 - update existing postVote document

      const batch = writeBatch(firestore);
      // create copies of state
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      // represents amount to add or subtract from post votes
      let voteChange = vote;

      // IS A NEW VOTE
      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote, // will be a 1 or  -1
        };

        batch.set(postVoteRef, newVote);

        // add or subtract 1 to/from the current vote status
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }
      // Existing vote - user has voted on the post before
      else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        // user Removing existing vote -- vote matches value of existing vote - changes by 1
        if (existingVote.voteValue === vote) {
          // add or subtract one from postVotestatus
          updatedPost.voteStatus = voteStatus - vote;
          // remove existing vote from postvotes array
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete postVotesDocument
          batch.delete(postVoteRef);

          voteChange *= -1;
        }
        // user is flipping vote --- changes by 2
        else {
          // add/subtract 2 to/from vote status
          voteChange = 2 * vote;

          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };

          // update post document
          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      // update post document in database
      const postDocRef = doc(firestore, "posts", post.id!);

      batch.update(postDocRef, {
        voteStatus: voteStatus + voteChange,
      });

      await batch.commit();

      // update state -- recoil state
      const postIndex = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIndex] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
    } catch (error) {
      console.error("onVoteError", error);
    }
  };

  const onSelectPost = () => {};

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if post has image and delete the image
      if (post.imageURL) {
        const imageRef = ref(storage, `post/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete the post itself from firestore database
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);
      // update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);

    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  React.useEffect(() => {
    if (!user || !currentCommunity?.id) return;

    getCommunityPostVotes(currentCommunity.id);
  }, [currentCommunity, user]);

  React.useEffect(() => {
    if (!user) {
      // clear user post votes
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
