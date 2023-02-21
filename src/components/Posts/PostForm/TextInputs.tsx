import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type Props = {};

const TextInputs = (props: Props) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="post"
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Textarea
        name="body"
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        height="100px"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex justify={"flex-end"}>
        <Button
          height="34px"
          padding="0px 30px"
          disabled={false}
          onClick={() => {}}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInputs;
