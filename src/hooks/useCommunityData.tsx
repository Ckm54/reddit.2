import { authModalState } from "@/atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "@/atoms/communityAtom";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // is user signed in
    // if not open auth modal
    if (!user) {
      // open login modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const getMysnippets = async () => {
    setLoading(true);
    try {
      // get user snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error: any) {
      console.log("get snippets error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    // creating a new community snippet for this user
    // updating the number of members in the community
    setLoading(true);

    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoil state ==== communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("Join community error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    // delete community snippet for this user
    // updating the number of members in the community
    setLoading(true);

    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();
      // update recoil state ==== communityState.mySnippets

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leave community error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
      }));
      return;
    }
    getMysnippets();
  }, [user]);

  return {
    // data and functions
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};

export default useCommunityData;
