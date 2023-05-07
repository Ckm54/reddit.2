import AboutCommunity from "@/components/Community/AboutCommunity";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

const Submit = () => {
  const [user] = useAuthState(auth);
  // const communityStateValue = useRecoilValue(communityState);
  const { communityStateValue } = useCommunityData();

  return (
    <PageContent>
      <>
        <Box padding="14px 0" borderBottom={"1px solid"} borderColor="#fff">
          <Text>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageUrl={communityStateValue.currentCommunity?.imageURL}
          />
        )}
      </>
      {communityStateValue.currentCommunity && (
        <AboutCommunity communityData={communityStateValue.currentCommunity} />
      )}
    </PageContent>
  );
};

export default Submit;
