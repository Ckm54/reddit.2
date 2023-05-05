import { communityState } from "@/atoms/communityAtom";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";

type Props = {};

const Submit = (props: Props) => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);

  console.log("Community", communityStateValue);

  return (
    <PageContent>
      <>
        <Box padding="14px 0" borderBottom={"1px solid"} borderColor="#fff">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>right</>
    </PageContent>
  );
};

export default Submit;
