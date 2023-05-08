import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    _event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs = ({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
}: TextInputsProps) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        onChange={onChange}
        value={textInputs.title}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        _placeholder={{ color: 'gray.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Textarea
        name="body"
        onChange={onChange}
        value={textInputs.body}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Text(optional)"
        height="100px"
        _placeholder={{ color: 'gray.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Flex justify={'flex-end'}>
        <Button
          height="34px"
          padding="0px 30px"
          isDisabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInputs;
