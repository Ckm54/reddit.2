import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  Icon,
  Flex,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { firestore } from "@/firebase/clientApp";
import React from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal = ({ open, handleClose }: Props) => {
  const [communityName, setCommunityName] = React.useState("");
  const [charactersRemaining, setCharactersRemaining] = React.useState(21);
  const [communityType, setcommunityType] = React.useState("public");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [ user ] = useAuthState(auth);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // recalculate how many characters are left
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharactersRemaining(21 - event.target.value.length);
  };

  const handleCreateCommunity = async () => {
    // validate the community name --- btwn 3 and 21 characters and not already in use
    if (error) setError("");
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Community names must be between 3 and 21 characters, and can only contain letters, numbers or underscores"
      );
      return;
    }
    
    setLoading(true);
   try {
     // check name is not taken
    // if valid --- create the community document in firestore
    const communityDocumentReference = doc(firestore, 'communities', communityName);

    await runTransaction(firestore, async (transaction) => {
      const communityDoc = await transaction.get(communityDocumentReference);
  
      if(communityDoc.exists()) {
        throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
      }

      transaction.set(communityDocumentReference, {
        creatorId: user?.uid,
        createdAt: serverTimestamp(),
        numberOfMembers: 1,
        privacyType: communityType,
        // creator id
        // createdAt
        // numberOfMembers
        // Privacy type
      });

      // create community snippet on user
      transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
        communityId: communityName,
        isModerator: true,
      })
    })


   } catch (error: any) {
    console.log('handleCreateCommunity error', error);
    setError(error.message)
   }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            flexDirection="column"
            fontSize={15}
            p={3}
          >
            Create a community
          </ModalHeader>
          <Box px={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              flexDirection="column"
              padding="10px 0px"
            >
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color={"gray.500"}>
                Community names including capitalizations cannot be changed.
              </Text>
              <Text
                position={"relative"}
                top="28px"
                left="10px"
                width="20px"
                color={"gray.400"}
              >
                r/
              </Text>
              <Input
                position={"relative"}
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                fontSize={"9pt"}
                color={charactersRemaining === 0 ? "red" : "gray.500"}
              >
                {charactersRemaining} Characters remaining.
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>

              <Box mt={4} mb={4}>
                <Text fontSize={15} fontWeight={600}>
                  Community Type
                </Text>
                <RadioGroup onChange={setcommunityType} value={communityType}>
                  <Stack spacing={2}>
                    <Radio value="public">
                      <Flex align={"center"}>
                        <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                        <Text fontSize={"10pt"} mr={1}>
                          Public
                        </Text>
                        <Text fontSize={"8pt"} color="gray.500" pt={1}>
                          Anyone can view, post and comment to this community
                        </Text>
                      </Flex>
                    </Radio>

                    <Radio value="restricted">
                      <Flex align={"center"}>
                        <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                        <Text fontSize={"10pt"} mr={1}>
                          Restricted
                        </Text>
                        <Text fontSize={"8pt"} color="gray.500" pt={1}>
                          Anyone can view this community, but only approved
                          users can post.
                        </Text>
                      </Flex>
                    </Radio>

                    <Radio value="private">
                      <Flex align={"center"}>
                        <Icon as={HiLockClosed} color="gray.500" mr={2} />
                        <Text fontSize={"10pt"} mr={1}>
                          Private
                        </Text>
                        <Text fontSize={"8pt"} color="gray.500" pt={1}>
                          Only approved users can view and submit to this
                          community.
                        </Text>
                      </Flex>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg={"gray.100"} borderRadius="0px opx 10px 10px">
            <Button
              variant={"outline"}
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button height="30px" onClick={handleCreateCommunity} isLoading={loading}>
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;
