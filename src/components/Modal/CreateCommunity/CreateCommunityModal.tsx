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
import React from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal = ({ open, handleClose }: Props) => {
  const [communityName, setCommunityName] = React.useState("");
  const [charactersRemaining, setCharactersRemaining] = React.useState(21);
  const [communitytype, setCommunitytype] = React.useState("public");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // recalculate how many characters are left
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharactersRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunitytype(event.target.name);
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

              <Box mt={4} mb={4}>
                <Text fontSize={15} fontWeight={600}>
                  Community Type
                </Text>
                <RadioGroup onChange={setCommunitytype} value={communitytype}>
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
            <Button height='30px' onClick={() => {}}>Create Community</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;
