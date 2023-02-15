import { Community } from "@/atoms/communityAtom";
import Header from "@/components/Community/Header";
import CommunityNotFound from "@/components/Community/NotFound";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage = ({ communityData }: CommunityPageProps) => {
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass to client
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    // could add an error page
    console.log("getServersidePropsError", error);
  }
}

export default CommunityPage;
