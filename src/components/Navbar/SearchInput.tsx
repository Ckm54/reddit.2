import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

type Props = {
  // user:
};

function SearchInput({}: Props) {
  return (
    <Flex flexGrow={1} mr={2} align="center">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" mb={1}/>
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search reddit"
          fontSize={"10pt"}
          _placeholder={{ color: "gray.500" }}
          _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
          _focus={{outline: 'none', border: '1px solid', borderColor: 'blue.500'}}
          height='34px'
          background={'gray.50'}
        />
      </InputGroup>
    </Flex>
  );
}

export default SearchInput;
