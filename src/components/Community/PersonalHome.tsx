import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import useDirectory from "@/hooks/useDirectory";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";

const PersonalHome = () => {
  const { toggleMenuOpen } = useDirectory();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleOpenMenu = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    } else {
      // open directory menu
      toggleMenuOpen();
    }
  };

  return (
    <Flex
      direction={"column"}
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor={"gray.300"}
      // position="sticky"
    >
      <Flex
        align={"flex-end"}
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius={"4px 4px 0px 0px"}
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize={"cover"}
      ></Flex>

      <Flex direction={"column"} p="12px">
        <Flex align={"center"} mb={2}>
          <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize={"9pt"}>
            Your personal Reddit Homepage, built for you.
          </Text>
          <Button height={"38px"} onClick={handleOpenMenu}>
            Create Post
          </Button>
          <Button variant={"outline"} height="38px" onClick={handleOpenMenu}>
            Create Community
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default PersonalHome;
