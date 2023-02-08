import { authModalState } from '@/atoms/authModalAtom';
import { auth } from '@/firebase/clientApp';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react'
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

const Signup = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signUpFormValues, setSignUpFormValues] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    userError,
  ] = useCreateUserWithEmailAndPassword(auth);
  const [error, setError] = React.useState('');

  // handle firebase logic
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(error) setError('');

    if(signUpFormValues.password !== signUpFormValues.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    createUserWithEmailAndPassword(signUpFormValues.email, signUpFormValues.password)
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //update form state
    setSignUpFormValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="email"
        required
        placeholder="email"
        type={"email"}
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        name="password"
        required
        placeholder="password"
        type={"password"}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        name="confirmPassword"
        required
        placeholder="confirm password"
        type={"password"}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      {error && <Text textAlign={'center'} color='red' fontSize={'10pt'} mt={4}>{error}</Text>}
      <Button width="100%" height="36px" mt={2} mb={2} type="submit">
        Sign Up
      </Button>

      <Flex fontSize={"9pt"} justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState(prev => ({
              ...prev,
              view: 'login',
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
}

export default Signup